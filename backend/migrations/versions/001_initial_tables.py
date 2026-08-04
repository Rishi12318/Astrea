"""Initial tables: users, skin_profiles, products, product_shades, recommendation_history, user_feedback

Revision ID: 001_initial_tables
Revises: 
Create Date: 2026-07-21

"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "001_initial_tables"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # users
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_users_id", "users", ["id"])
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    # skin_profiles
    op.create_table(
        "skin_profiles",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("skin_tone", sa.String(50), nullable=True),
        sa.Column("undertone", sa.String(50), nullable=True),
        sa.Column("face_shape", sa.String(50), nullable=True),
        sa.Column("eye_shape", sa.String(50), nullable=True),
        sa.Column("lip_shape", sa.String(50), nullable=True),
        sa.Column("preferences", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_skin_profiles_id", "skin_profiles", ["id"])
    op.create_index("ix_skin_profiles_user_id", "skin_profiles", ["user_id"])

    # products
    op.create_table(
        "products",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("category", sa.String(100), nullable=False),
        sa.Column("brand", sa.String(100), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("price", sa.Float(), nullable=True),
        sa.Column("image_url", sa.String(500), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_products_id", "products", ["id"])
    op.create_index("ix_products_category", "products", ["category"])
    op.create_index("ix_products_brand", "products", ["brand"])

    # product_shades
    op.create_table(
        "product_shades",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("product_id", sa.Integer(), nullable=False),
        sa.Column("shade_name", sa.String(100), nullable=False),
        sa.Column("skin_tone", sa.String(50), nullable=False),
        sa.Column("undertone", sa.String(50), nullable=False),
        sa.Column("hex_color", sa.String(7), nullable=False),
        sa.Column("lab_l", sa.Float(), nullable=False),
        sa.Column("lab_a", sa.Float(), nullable=False),
        sa.Column("lab_b", sa.Float(), nullable=False),
        sa.Column("embedding_json", sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(["product_id"], ["products.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_product_shades_id", "product_shades", ["id"])
    op.create_index("ix_product_shades_product_id", "product_shades", ["product_id"])
    op.create_index("ix_product_shades_skin_tone", "product_shades", ["skin_tone"])
    op.create_index("ix_product_shades_undertone", "product_shades", ["undertone"])

    # recommendation_history
    op.create_table(
        "recommendation_history",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("request_payload", sa.Text(), nullable=False),
        sa.Column("response_payload", sa.Text(), nullable=False),
        sa.Column("model_confidence", sa.String(50), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_recommendation_history_id", "recommendation_history", ["id"])
    op.create_index("ix_recommendation_history_user_id", "recommendation_history", ["user_id"])

    # user_feedback
    op.create_table(
        "user_feedback",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("product_id", sa.Integer(), nullable=True),
        sa.Column("score", sa.Integer(), nullable=False),
        sa.Column("comment", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["product_id"], ["products.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_user_feedback_id", "user_feedback", ["id"])


def downgrade() -> None:
    op.drop_table("user_feedback")
    op.drop_table("recommendation_history")
    op.drop_table("product_shades")
    op.drop_table("products")
    op.drop_table("skin_profiles")
    op.drop_table("users")
