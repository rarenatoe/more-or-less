# @rntext/more-or-less

A React Native component that renders text with more/less buttons in just 2 renders.

## What does this library do better than others ?

- Fully coded in typescript.
- Does everything in 2 renders.
- Can add custom Text Component.
- Can provide custom onPress method, disabling toggle behavior. Useful for using modals and the such.
- [...More features coming...]

## Installation

```sh
npm install @rntext/more-or-less
```

or

```sh
yarn add @rntext/more-or-less
```

## Usage

```ts
import { MoreOrLess } from "@rntext/more-or-less";

// ...

export default function App() {
  return (
    <MoreOrLess numberOfLines={3} textComponent={CustomText}>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book. It has survived not only five centuries, but
      also the leap into electronic typesetting, remaining essentially
      unchanged. It was popularised in the 1960s with the release of Letraset
      sheets containing Lorem Ipsum passages, and more recently with desktop
      publishing software like Aldus PageMaker including versions of Lorem
      Ipsum.
    </MoreOrLess>
  );
}

```

### Props

| Prop | Type | Required | Default | Note |
|------|------|----------|---------|------|
| children | string | yes | - | Text to be capped and formatted |
| numberOfLines | number | yes | - | Number of lines at which it will cap the paragraph |
| animated | boolean | no | false | Whether to animate the expanding/shrinking or not |
| buttonTextStyle | TextStyle | no | undefined | Style for the Text Button |
| containerStyle | ViewStyle | no | undefined | Style for the container View |
| onMorePress | () => void | no | expandText | Function used for the more button |
| textComponent | ComponentType&lt;TextProps> | no | Text | Text component to use in all text |
| textStyle | TextStyle | no | undefined | Style for the Text component |

### Text styling

MoreOrLess will apply the following styles on top of the previous, into the `style` prop of `textComponent`:

1. Apply `textStyle`.
2. Then if it is a button:
    1. Apply `textButtonStyle`.

## Run example

```sh
git clone https://github.com/rarenatoe/more-or-less.git
cd more-or-less/example
yarn install # or npm install
# to run on iOS
yarn ios
#to run on android
yarn android
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
