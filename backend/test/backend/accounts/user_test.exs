defmodule Backend.Accounts.UserTest do
  use BackendWeb.ConnCase, async: false

  @register_query """
  mutation Register($input: RegisterWithPasswordInput!) {
  	register_with_password(input: $input) {
  		result {
  			id
  			email
  			first_name
  			last_name
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
  		id
  		token
  		email
  		first_name
  		last_name
  	}
  }
  """

  @me_query """
  query Me {
  	me {
  		id
  		email
  		first_name
  		last_name
  	}
  }
  """

  test "registers, signs in, and reads the current user through GraphQL", %{conn: conn} do
    credentials = %{
      "email" => "user@example.com",
      "first_name" => "Ada",
      "last_name" => "Lovelace",
      "password" => "correct horse battery staple"
    }

    {_, %{"data" => %{"register_with_password" => registration}}} =
      run_graphql(conn, @register_query, %{"input" => credentials})

    assert registration["errors"] == []
    registered_user = registration["result"]
    assert registered_user["email"] == credentials["email"]
    assert registered_user["first_name"] == credentials["first_name"]
    assert registered_user["last_name"] == credentials["last_name"]

    {_, sign_in_response} =
      run_graphql(Phoenix.ConnTest.build_conn(), @sign_in_query, %{
        "email" => credentials["email"],
        "password" => credentials["password"]
      })

    assert sign_in_response["errors"] in [nil, []]
    signed_in_user = sign_in_response["data"]["sign_in_with_password"]
    assert signed_in_user["id"] == registered_user["id"]
    assert signed_in_user["email"] == registered_user["email"]
    assert is_binary(signed_in_user["token"])
    assert signed_in_user["token"] != ""

    {_, %{"data" => %{"me" => current_user}}} =
      Phoenix.ConnTest.build_conn()
      |> Plug.Conn.put_req_header("authorization", "Bearer #{signed_in_user["token"]}")
      |> run_graphql(@me_query)

    assert current_user == registered_user
  end

  test "returns a structured error for invalid credentials", %{conn: conn} do
    {_, response} =
      run_graphql(conn, @sign_in_query, %{
        "email" => "unknown@example.com",
        "password" => "incorrect password"
      })

    assert [%{"code" => "authentication_failed", "message" => "Authentication failed"}] =
             response["errors"]
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
