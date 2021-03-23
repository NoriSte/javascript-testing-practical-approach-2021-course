import { useEffect } from 'react'

const useMount = (mount: () => void) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(mount, [])
}

export default useMount
