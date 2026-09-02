defmodule Backend.Accounts.Token do
  use Ash.Resource,
    otp_app: :backend,
    domain: Backend.Accounts,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshAuthentication.TokenResource],
    authorizers: [Ash.Policy.Authorizer]

  attributes do
    attribute :jti, :string do
      allow_nil?(false)
      primary_key?(true)
      sensitive?(true)
      public?(true)
      default(fn -> Base52UUID.prefixed(AshPostgres.DataLayer.Info.table(__MODULE__)) end)
    end
  end

  postgres do
    table("tokens")
    repo(Backend.Repo)
  end

  policies do
    bypass AshAuthentication.Checks.AshAuthenticationInteraction do
      authorize_if(always())
    end
  end
end
