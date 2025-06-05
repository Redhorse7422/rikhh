import type { FC } from 'react'

import { MainLayoutBase, type MainLayoutBaseProps } from './MainLayout'

type MainLayoutProps = MainLayoutBaseProps

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return <MainLayoutBase>{children}</MainLayoutBase>
}
