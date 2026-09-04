defmodule Backend.Punchlines.Punchline do
  use Ecto.Schema
  use Backend.CommonSchema

  @primary_key false
  schema "punchlines" do
    field(:id, :string, primary_key: true)
    field(:line, :string)

    common_fields()
  end

  def changeset(punchline, attrs) do
    Ecto.Changeset.cast(punchline, attrs, [:line])
  end
end
