[
  import_deps: [:ash_graphql, :absinthe, :ecto, :ecto_sql, :phoenix],
  subdirectories: ["priv/*/migrations"],
  inputs: ["*.{ex,exs}", "{config,lib,test}/**/*.{ex,exs}", "priv/*/seeds.exs"],
  plugins: [Absinthe.Formatter]
]
