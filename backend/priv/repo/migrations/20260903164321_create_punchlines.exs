defmodule Backend.Repo.Migrations.CreatePunchlines do
  use Ecto.Migration

  def change do
    create table(:punchlines, primary_key: false) do
      add(:id, :text, primary_key: true)
      add(:line, :text)
      add(:created_by, references(:users, column: :id, type: :text), null: false)

      add(:inserted_at, :utc_datetime_usec,
        null: false,
        default: fragment("(now() AT TIME ZONE 'utc')")
      )

      add(:updated_by, references(:users, column: :id, type: :text), null: false)

      add(:updated_at, :utc_datetime_usec,
        null: false,
        default: fragment("(now() AT TIME ZONE 'utc')")
      )

      add(:is_deleted, :boolean, null: false, default: false)
      add(:deleted_by, references(:users, column: :id, type: :text))
      add(:deleted_at, :utc_datetime_usec)
    end
  end
end
