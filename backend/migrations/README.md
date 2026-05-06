# Migrations

This folder is prepared for Alembic database migrations. Create revision files under `versions/` when the schema evolves in production.

Recommended workflow:

1. Initialize the migration environment if needed.
2. Create a new revision for each schema change.
3. Apply migrations during deployment before service startup.
