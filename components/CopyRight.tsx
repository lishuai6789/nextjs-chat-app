import { memo, ReactElement } from 'react'
function CopyRight(): ReactElement {
  return (
    <p>
      Copyright © 李帅的网站
    </p>
  )
}
export default memo(CopyRight)