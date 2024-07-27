import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import userAxios from './apis/userApi';
import CreateGroup from './CreateGroup';

const Homepage = ({ users, setUsers }) => {
  const [groups, setGroups] = useState({});
  const { id, year, month } = useParams();
  const intakeYear = parseInt(year);
  const removeGroupYear = 2021;
  const yearId = intakeYear - removeGroupYear;

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groupsData = await userAxios.get(`/groups/${yearId}`);
        if (!groupsData.data) {
          setGroups({});
        }
        setGroups(groupsData.data);
      } catch (error) {
        console.error(`An error occured getting groups`);
      }
    }
    fetchGroups();
  }, [yearId])

  return (
    <main>
      <section>
        <CreateGroup
          groups={groups}
          setGroups={setGroups}
          month={month}
          year={year}
          yearId={yearId}
          id={id}
          users={users}
          setUsers={setUsers}
        />
      </section>
    </main>
  )
}

export default Homepage