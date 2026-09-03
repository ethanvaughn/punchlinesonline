defmodule BackendWeb.GraphQL.PunchlineResolver do
  alias Backend.Punchlines
  alias Backend.Punchlines.Punchline
  alias Backend.Repo

  def list(_, _, _) do
    {:ok, Punchlines.list_punchlines()}
  end

  def create(_, %{input: input}, resolution) do
    with {:ok, actor_id} <- actor_id(resolution),
         {:ok, punchline} <- Punchlines.create_punchline(input, actor_id) do
      {:ok, punchline}
    end
  end

  def update(_, %{id: id, input: input}, resolution) do
    with {:ok, actor_id} <- actor_id(resolution),
         %Punchline{} = punchline <- Repo.get(Punchline, id),
         {:ok, punchline} <- Punchlines.update_punchline(punchline, input, actor_id) do
      {:ok, punchline}
    else
      nil -> {:error, "Punchline not found"}
      error -> error
    end
  end

  def delete(_, %{id: id}, resolution) do
    with {:ok, actor_id} <- actor_id(resolution),
         %Punchline{} = punchline <- Repo.get(Punchline, id),
         {:ok, punchline} <- Punchlines.delete_punchline(punchline, actor_id) do
      {:ok, punchline}
    else
      nil -> {:error, "Punchline not found"}
      error -> error
    end
  end

  defp actor_id(%{context: %{actor: %{id: id}}}), do: {:ok, id}
  defp actor_id(_resolution), do: {:error, "Authentication required"}
end
