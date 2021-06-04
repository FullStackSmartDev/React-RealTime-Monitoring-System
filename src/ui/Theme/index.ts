import * as styledComponents from 'styled-components';

export interface ThemeInterface {
  defaultBackgroundColor?: string;
}

const {
  default: styled,
  css,
  keyframes,
  createGlobalStyle,
  ThemeProvider,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<ThemeInterface>;

export const theme: ThemeInterface = {
  defaultBackgroundColor: '#fff',
};

export default styled;
export { css, keyframes, ThemeProvider, createGlobalStyle };
