defmodule Backend.Punchlines do
  import Ecto.Query

  alias Backend.Punchlines.Punchline
  alias Backend.Repo

  def list_punchlines do
    from(punchline in Punchline, where: not punchline.is_deleted, order_by: punchline.inserted_at)
    |> Repo.all()
  end

  def create_punchline(attrs, actor_id) do
    %Punchline{}
    |> Punchline.changeset(attrs)
    |> Ecto.Changeset.put_change(:id, Base52UUID.prefixed("punchlines"))
    |> Ecto.Changeset.put_change(:created_by, actor_id)
    |> Ecto.Changeset.put_change(:updated_by, actor_id)
    |> Repo.insert()
  end

  def update_punchline(%Punchline{} = punchline, attrs, actor_id) do
    punchline
    |> Punchline.changeset(attrs)
    |> Ecto.Changeset.put_change(:updated_by, actor_id)
    |> Repo.update()
  end

  def delete_punchline(%Punchline{} = punchline, actor_id) do
    punchline
    |> Ecto.Changeset.change(
      is_deleted: true,
      deleted_by: actor_id,
      deleted_at: DateTime.utc_now()
    )
    |> Repo.update()
  end
end
