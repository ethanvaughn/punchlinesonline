defmodule Backend.Punchlines.PunchlineTest do
  use BackendWeb.ConnCase, async: false

  alias Backend.Punchlines.Punchline

  @register_query """
  mutation Register($input: RegisterWithPasswordInput!) {
    register_with_password(input: $input) {
      result {
        id
      }
      errors {
        message
      }
    }
  }
  """

  @sign_in_query """
  mutation SignInWithPassword($email: String!, $password: String!) {
    sign_in_with_password(email: $email, password: $password) {
      token
    }
  }
  """

  @create_punchline_query """
  mutation CreatePunchline($input: PunchlineInput!) {
    create_punchline(input: $input) {
      id
      line
      created_by
      is_deleted
    }
  }
  """

  @delete_punchline_query """
  mutation DeletePunchline($id: String!) {
    delete_punchline(id: $id) {
      id
      line
      is_deleted
      deleted_by
      deleted_at
    }
  }
  """

  @update_punchline_query """
  mutation UpdatePunchline($id: String!, $input: PunchlineInput!) {
    update_punchline(id: $id, input: $input) {
      id
      line
      updated_by
      is_deleted
    }
  }
  """

  @punchlines_query """
  query Punchlines {
    punchlines {
      id
      line
      created_by
      updated_by
      is_deleted
    }
  }
  """

  test "creates, deletes, updates, and lists punchlines through GraphQL", %{conn: conn} do
    credentials = %{
      "email" => "punchline-#{System.unique_integer([:positive])}@example.com",
      "first_name" => "Punchline",
      "last_name" => "Tester",
      "password" => "correct horse battery staple"
    }

    {_, %{"data" => %{"register_with_password" => registration}}} =
      run_graphql(conn, @register_query, %{"input" => credentials})

    assert registration["errors"] == []
    assert is_binary(registration["result"]["id"])

    {_, %{"data" => %{"sign_in_with_password" => signed_in_user}}} =
      run_graphql(Phoenix.ConnTest.build_conn(), @sign_in_query, %{
        "email" => credentials["email"],
        "password" => credentials["password"]
      })

    authenticated_conn =
      Phoenix.ConnTest.build_conn()
      |> Plug.Conn.put_req_header("authorization", "Bearer #{signed_in_user["token"]}")

    punchlines =
      for line <- ["First punchline", "Second punchline", "Third punchline"] do
        {_, %{"data" => %{"create_punchline" => punchline}}} =
          run_graphql(authenticated_conn, @create_punchline_query, %{"input" => %{"line" => line}})

        assert punchline["line"] == line
        assert punchline["is_deleted"] == false
        assert is_binary(punchline["id"])
        assert is_binary(punchline["created_by"])
        punchline
      end

    [first_punchline, second_punchline, third_punchline] = punchlines

    {_, %{"data" => %{"delete_punchline" => deleted_punchline}}} =
      run_graphql(authenticated_conn, @delete_punchline_query, %{
        "id" => first_punchline["id"]
      })

    assert deleted_punchline["id"] == first_punchline["id"]
    assert deleted_punchline["is_deleted"] == true
    assert deleted_punchline["deleted_by"] == first_punchline["created_by"]
    assert is_binary(deleted_punchline["deleted_at"])

    {_, %{"data" => %{"update_punchline" => updated_punchline}}} =
      run_graphql(authenticated_conn, @update_punchline_query, %{
        "id" => second_punchline["id"],
        "input" => %{"line" => "Updated punchline"}
      })

    assert updated_punchline["id"] == second_punchline["id"]
    assert updated_punchline["line"] == "Updated punchline"
    assert updated_punchline["updated_by"] == second_punchline["created_by"]
    assert updated_punchline["is_deleted"] == false

    {_, %{"data" => %{"punchlines" => listed_punchlines}}} =
      run_graphql(Phoenix.ConnTest.build_conn(), @punchlines_query)

    assert Enum.map(listed_punchlines, & &1["id"]) == [
             second_punchline["id"],
             third_punchline["id"]
           ]

    assert Enum.find(listed_punchlines, &(&1["id"] == second_punchline["id"]))["line"] ==
             "Updated punchline"

    assert Enum.all?(listed_punchlines, &(&1["is_deleted"] == false))
  end

  test "defines the punchline fields and conventional timestamps" do
    punchline = %Punchline{}

    assert punchline.line == nil
    assert punchline.created_by == nil
    assert punchline.updated_by == nil
    assert punchline.is_deleted == false
    assert punchline.deleted_by == nil
    assert punchline.deleted_at == nil
    assert punchline.inserted_at == nil
    assert punchline.updated_at == nil
  end

  test "line is nullable and only line is client-castable" do
    changeset = Punchline.changeset(%Punchline{}, %{"line" => nil})

    assert changeset.valid?
    assert Ecto.Changeset.get_change(changeset, :line) == nil
    refute Ecto.Changeset.get_change(changeset, :created_by)
    refute Ecto.Changeset.get_change(changeset, :updated_by)
  end

  defp run_graphql(conn, document, variables \\ %{}) do
    conn =
      conn
      |> Plug.Conn.put_req_header("content-type", "application/json")
      |> Phoenix.ConnTest.post(
        "/gql",
        Jason.encode!(%{"query" => document, "variables" => variables})
      )

    {conn, Phoenix.ConnTest.json_response(conn, 200)}
  end
end
