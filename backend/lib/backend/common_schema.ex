defmodule Backend.CommonSchema do
  defmacro __using__(_opts) do
    quote do
      import Backend.CommonSchema, only: [common_fields: 0]
    end
  end

  defmacro common_fields do
    quote do
      field(:created_by, :string)
      field(:updated_by, :string)
      field(:is_deleted, :boolean, default: false)
      field(:deleted_by, :string)
      field(:deleted_at, :utc_datetime_usec)

      timestamps(inserted_at: :inserted_at, updated_at: :updated_at, type: :utc_datetime_usec)
    end
  end
end
