# Weighted Random (Elixir)
###### May 17, 2017

This is an Elixir implementation of a weighted random generator, inspired by my [previous exploration](/weighted-random) using JavaScript.

## Implementation

```elixir
defmodule WeightedRandom do

  @doc """
  Returns an anonymous function that when called will
  return a value from the given data set with a given
  weighted chance.
  """
  def new(data) do
    total_weight = Enum.reduce(data, 0, fn({w, _}, acc) -> w + acc end)

    fn ->
      target = :rand.uniform() * total_weight

      Enum.reduce_while data, target, fn({wgt, val}, acc) ->
        cond do
          acc - wgt > 0 ->
            {:cont, acc - wgt}
          true ->
            {:halt, val}
        end
      end
    end
  end
end
```

The following example has a 50% chance of returning `"a"`, a 35% chance of returning `"b"`, and a 15% chance of returning `"c"`.

```
iex(1)> data = [{0.50, :foo}, {0.35, :bar}, {0.15, :baz}]
iex(2)> generator = WeightedRandom.new(data)
iex(3)> generator.();
:bar
iex(4)> generator.();
:foo
```
