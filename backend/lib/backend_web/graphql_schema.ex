defmodule BackendWeb.GraphqlSchema do
  use Absinthe.Schema

  use AshGraphql,
    domains: [Backend.Accounts]

  import_types(Absinthe.Plug.Types)

  object :punchline do
    field(:id, non_null(:string))
    field(:line, :string)
    field(:created_by, non_null(:string))
    field(:owner_name, non_null(:string))
    field(:inserted_at, non_null(:datetime))
    field(:updated_by, non_null(:string))
    field(:updated_at, non_null(:datetime))
    field(:is_deleted, non_null(:boolean))
    field(:deleted_by, :string)
    field(:deleted_at, :datetime)
  end

  input_object :punchline_input do
    field(:line, :string)
  end

  query do
    # Custom Absinthe queries can be placed here
    @desc """
    Hello! This is a sample query to verify that AshGraphql has been set up correctly.
    Remove me once you have a query of your own!
    """
    field :say_hello, :string do
      resolve(fn _, _, _ ->
        {:ok, "Hello from AshGraphql!"}
      end)
    end

    field :punchlines, non_null(list_of(non_null(:punchline))) do
      resolve(&BackendWeb.GraphQL.PunchlineResolver.list/3)
    end
  end

  mutation do
    field :create_punchline, :punchline do
      arg(:input, non_null(:punchline_input))
      resolve(&BackendWeb.GraphQL.PunchlineResolver.create/3)
    end

    field :update_punchline, :punchline do
      arg(:id, non_null(:string))
      arg(:input, non_null(:punchline_input))
      resolve(&BackendWeb.GraphQL.PunchlineResolver.update/3)
    end

    field :delete_punchline, :punchline do
      arg(:id, non_null(:string))
      resolve(&BackendWeb.GraphQL.PunchlineResolver.delete/3)
    end
  end

  subscription do
    # Custom Absinthe subscriptions can be placed here
  end
end
