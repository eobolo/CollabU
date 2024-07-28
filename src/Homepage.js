import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import userAxios from './apis/userApi';
import CreateGroup from './CreateGroup';
import MyGroup from './MyGroup';
import AllGroup from './AllGroup';
import HomepageHeader from './HomepageHeader';

const Homepage = ({ users, setUsers }) => {
  const [groups, setGroups] = useState({});
  const [isGroupsGotten, setIsGroupGotten] = useState(false);
  const { id, year, month } = useParams();
  const intakeYear = parseInt(year);
  const removeGroupYear = 2021;
  const yearId = intakeYear - removeGroupYear;

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groupsData = await userAxios.get(`/groups/${yearId}`);
        const isDataGotten = Object.keys(groupsData.data).length > 0
        if (!isDataGotten) {
          setIsGroupGotten(false);
        } else {
          setGroups(groupsData.data);
          setIsGroupGotten(true);
        }
      } catch (error) {
        console.error(`An error occured getting groups`);
      }
    }
    fetchGroups();
  }, [yearId])
  return (
    <main>
      <section>
        {isGroupsGotten ? (
          <HomepageHeader
            month={month}
            year={year}
            id={id}
            users={users}
            groups={groups}
          />
        ) : null}
        {isGroupsGotten ? (
          <>
            <MyGroup
              groups={groups}
              setGroups={setGroups}
              month={month}
              year={year}
              yearId={yearId}
              id={id}
              users={users}
              setUsers={setUsers}
            />
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
            <AllGroup
              groups={groups}
              setGroups={setGroups}
              month={month}
              year={year}
              yearId={yearId}
              id={id}
              users={users}
              setUsers={setUsers}           
            />
          </>
        ) : null}
      </section>
    </main>
  )
}

export default Homepage