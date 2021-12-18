import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../auth-context';
import UserItem from './UserItem';
import UserEditItem from './UserEditItem';

function Users() {
  const auth = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  const [userId, setUserId] = useState('');

  const onDetail = (productid) => {
    setUserId(productid);
  };

  useEffect(() => {
    const use = async () => {
      const us = await axios.get(
        process.env.REACT_APP_BACKEND_URL + 'users/all',
        {
          headers: { Authorization: 'Bearer ' + auth.token },
        }
      );
      setUsers(us.data.users);
    };
    use();
  }, [users, auth.token, auth.admin]);

  return (
    <div style={{ padding: '5% 1%' }}>
      {users.map((user) => {
        if (user._id.toString() === userId.toString()) {
          return (
            <UserEditItem key={user._id} user={user} onDetail={onDetail} />
          );
        } else {
          return <UserItem key={user._id} user={user} onDetail={onDetail} />;
        }
      })}
    </div>
  );
}

export default Users;
