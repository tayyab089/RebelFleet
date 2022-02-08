import React from 'react';

export const UserContext = React.createContext();
export const AuthContext = React.createContext();

// //State and Dispatch function
// export const [state, dispatch] = React.useReducer(
//     (prevState, action) => {
//       switch (action.type) {
//         case 'RESTORE_TOKEN':
//           return {
//             ...prevState,
//             userToken: action.token,
//             isLoading: false,
//           };
//         case 'SIGN_IN':
//           return {
//             ...prevState,
//             isSignout: false,
//             userToken: action.token,
//           };
//         case 'SIGN_OUT':
//           return {
//             ...prevState,
//             isSignout: true,
//             userToken: null,
//           };
//       }
//     },
//     {
//       isLoading: true,
//       isSignout: false,
//       userToken: null,
//     },
//   );

// // Ceating Context Variables
// export const authContext = React.useMemo(
//     () => ({
//       signIn: async (data, hideLoadingModal) => {
//         console.log(data);
//         const options = {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(data),
//         };
//         fetch('https://hidden-stream-06963.herokuapp.com/login', options)
//           .then(resp => resp.json())
//           .then(response => {
//             if (response.username === data.id) {
//               Keychain.setGenericPassword(
//                 JSON.stringify(response),
//                 JSON.stringify(response.token),
//               ).then((resp, err) => {
//                 if (err) {
//                   console.log(err);
//                 } else {
//                   console.log(response);
//                   //dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
//                   dispatch({type: 'SIGN_IN', token: response});
//                 }
//               });
//             } else {
//               Alert.alert(response.toString());
//             }
//           })
//           .catch(err => console.log(err));
//       },
//       signOut: async () => {
//         await Keychain.resetGenericPassword();
//         dispatch({type: 'SIGN_OUT'});
//       },
//       signUp: async data => {
//         const options = {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(data),
//         };
//         fetch('https://hidden-stream-06963.herokuapp.com/register', options)
//           .then(resp => resp.json())
//           .then(response => {
//             Alert.alert(response);
//             console.log(response);
//           })
//           .catch(err => console.log(err));
//       },
//       userToken: state.userToken,
//     }),
//     [],
//   );
//   export const userContext = {userToken: state.userToken};