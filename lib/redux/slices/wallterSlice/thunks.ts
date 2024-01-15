/* Instruments */
import useUnisat from '@/hook/useUnisat';
import type { ReduxThunkAction } from '@/lib/redux'
import { createAppAsyncThunk } from '@/lib/redux/createAppAsyncThunk'

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const connectUnisat = createAppAsyncThunk(
  'wallter/connectUnisat',
  async () => {
    const unisat = useUnisat()
    const [address] = await unisat.requestAccounts();
                // handleAccountsChanged(result);
    // const [address] = await unisat.getAccounts()
    // console.log({address},await unisat.getAccounts().then(console.log))
    return {address} 
    // The value we return becomes the `fulfilled` action payload
  }
)

