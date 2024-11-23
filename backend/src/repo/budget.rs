use sqlx::Acquire;
use uuid::Uuid;

use crate::{
    auth::Claims,
    error::{Error, Result},
    models::budget::{Monthly, MonthlyAdd, MonthlyUpdate},
};

pub struct BudgetRepo;

impl BudgetRepo {
    pub async fn monthly_get_all<'a, A>(connection: A, claims: Claims) -> Result<Vec<Monthly>>
    where
        A: Acquire<'a, Database = sqlx::Postgres>,
    {
        let mut connection = connection.acquire().await?;

        let budget = sqlx::query_as!(
            Monthly,
            r#"
            SELECT monthly.id, position, debit, credit
            FROM user_monthly
            JOIN monthly ON monthly.id = user_monthly.monthly_id
            WHERE user_id = $1
            ORDER BY monthly.id
            "#,
            claims.sub
        )
        .fetch_all(connection.as_mut())
        .await?;

        Ok(budget)
    }

    pub async fn insert_monthly<'a, A>(
        connection: A,
        claims: Claims,
        monthly: MonthlyAdd,
    ) -> Result<()>
    where
        A: Acquire<'a, Database = sqlx::Postgres>,
    {
        let mut connection = connection.begin().await?;

        let id = sqlx::query!(
            r#"
            INSERT INTO monthly (position, debit, credit)
            VALUES ($1, $2, $3)
            RETURNING id
            "#,
            monthly.position,
            monthly.debit.unwrap_or(0.0),
            monthly.credit.unwrap_or(0.0)
        )
        .fetch_one(connection.as_mut())
        .await?;

        sqlx::query!(
            r#"
            INSERT INTO user_monthly (user_id, monthly_id)
            VALUES ($1, $2)
            "#,
            claims.sub,
            id.id
        )
        .execute(connection.as_mut())
        .await?;

        connection.commit().await?;

        Ok(())
    }

    pub async fn update_monthly<'a, A>(
        connection: A,
        claims: Claims,
        entry: MonthlyUpdate,
    ) -> Result<()>
    where
        A: Acquire<'a, Database = sqlx::Postgres>,
    {
        let mut connection = connection.begin().await?;

        if !BudgetRepo::monthly_is_users(connection.as_mut(), &vec![entry.id], claims.sub).await? {
            return Err(Error::Unauthorized);
        }

        sqlx::query!(
            r#"
            UPDATE monthly
            SET position = COALESCE($1, position), 
                debit    = COALESCE($2, debit), 
                credit   = COALESCE($3, credit)
            WHERE id = $4
            "#,
            entry.position,
            entry.debit,
            entry.credit,
            entry.id
        )
        .execute(connection.as_mut())
        .await?;

        connection.commit().await?;

        Ok(())
    }

    pub async fn monthly_is_users<'a, A>(
        connection: A,
        monthly_id: &[Uuid],
        user_id: Uuid,
    ) -> Result<bool>
    where
        A: Acquire<'a, Database = sqlx::Postgres>,
    {
        let mut connection = connection.acquire().await?;

        let is_users = sqlx::query!(
            r#"
            SELECT EXISTS (
                SELECT 1
                FROM user_monthly
                WHERE user_id = $1 AND monthly_id IN (SELECT * FROM UNNEST($2::uuid[]))
            ) AS is_users
            "#,
            user_id,
            monthly_id
        )
        .fetch_one(connection.as_mut())
        .await?;

        Ok(is_users.is_users.unwrap_or(false))
    }

    pub async fn delete_monthly<'a, A>(
        connection: A,
        claims: Claims,
        monthly_id: &[Uuid],
    ) -> Result<()>
    where
        A: Acquire<'a, Database = sqlx::Postgres>,
    {
        let mut connection = connection.begin().await?;

        if !Self::monthly_is_users(connection.as_mut(), monthly_id, claims.sub).await? {
            return Err(Error::Unauthorized);
        }

        sqlx::query!(
            r#"
            DELETE FROM user_monthly
            WHERE user_id = $1 AND monthly_id IN (SELECT * FROM UNNEST($2::uuid[]))
            "#,
            claims.sub,
            monthly_id
        )
        .execute(connection.as_mut())
        .await?;

        sqlx::query!(
            r#"
            DELETE FROM monthly
            WHERE id IN (SELECT * FROM UNNEST($1::uuid[]))
            "#,
            monthly_id
        )
        .execute(connection.as_mut())
        .await?;

        connection.commit().await?;

        Ok(())
    }
}
