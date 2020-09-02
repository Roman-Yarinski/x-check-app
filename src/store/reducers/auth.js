const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')) || false,
  user: JSON.parse(localStorage.getItem('user')) || null,
  clientId: process.env.REACT_APP_CLIENT_ID,
  redirectURI: process.env.REACT_APP_REDIRECT_URI,
  clientSecret: process.env.REACT_APP_CLIENT_SECRET,
  proxyURL: process.env.REACT_APP_PROXY_URL,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN': {
      localStorage.setItem('isLoggedIn', JSON.stringify(action.payload.isLoggedIn))
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      // eslint-disable-next-line no-console
      console.log(action.payload.isLoggedIn)
      return {
        ...state,
        isLoggedIn: action.payload.isLoggedIn,
        user: action.payload.user,
      }
    }
    case 'LOGOUT': {
      localStorage.clear()
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      }
    }
    default:
      return state
  }
}

export default reducer
