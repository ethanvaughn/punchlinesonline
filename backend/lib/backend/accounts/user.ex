defmodule Backend.Accounts.User do
  use Ash.Resource,
    otp_app: :backend,
    domain: Backend.Accounts,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshAuthentication, AshGraphql.Resource],
    authorizers: [Ash.Policy.Authorizer]

  actions do
    defaults([:read])

    read :me do
      get?(true)
      filter(expr(id == ^actor(:id)))
    end
  end

  postgres do
    table("users")
    repo(Backend.Repo)
  end

  attributes do
    attribute :id, :string do
      allow_nil?(false)
      primary_key?(true)
      public?(true)
      writable?(false)
      default(fn -> Base52UUID.prefixed(AshPostgres.DataLayer.Info.table(__MODULE__)) end)
    end

    attribute :email, :ci_string do
      allow_nil?(false)
      public?(true)
    end

    attribute :first_name, :string do
      allow_nil?(false)
      public?(true)
    end

    attribute :last_name, :string do
      allow_nil?(false)
      public?(true)
    end

    attribute :hashed_password, :string do
      allow_nil?(false)
      sensitive?(true)
      public?(false)
    end
  end

  authentication do
    session_identifier(:jti)

    tokens do
      enabled?(true)
      token_resource(Backend.Accounts.Token)
      store_all_tokens?(true)
      require_token_presence_for_authentication?(true)

      signing_secret(fn _, _ ->
        Application.fetch_env(:backend, :token_signing_secret)
      end)
    end

    strategies do
      password :password do
        identity_field(:email)
        hashed_password_field(:hashed_password)
        confirmation_required?(false)
        register_action_accept([:first_name, :last_name])
      end
    end
  end

  graphql do
    type(:user)

    queries do
      read_one(:me, :me)

      read_one(:sign_in_with_password, :sign_in_with_password,
        type_name: :user_with_token,
        as_mutation?: true
      )
    end

    mutations do
      create(:register_with_password, :register_with_password)
    end
  end

  identities do
    identity(:unique_email, [:email])
  end

  policies do
    bypass AshAuthentication.Checks.AshAuthenticationInteraction do
      authorize_if(always())
    end

    policy action(:register_with_password) do
      authorize_if(always())
    end

    policy action(:sign_in_with_password) do
      authorize_if(always())
    end

    policy action_type(:read) do
      authorize_if(always())
    end
  end
end
