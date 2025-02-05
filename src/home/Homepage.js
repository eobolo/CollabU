import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Homepage.css';
import userAxios from '../apis/userApi';
import CreateGroup from '../group/CreateGroup';
import MyGroup from '../group/MyGroup';
import AllGroup from '../group/AllGroup';
import HomepageHeader from './HomepageHeader';


const Homepage = ({ users, setUsers, appDropDown, handleAppDropDown, showDropDown, handleShowDropDown, setAuthUser }) => {
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
      <section className='homepage-section'>
        {isGroupsGotten ? (
          <div className='fixed-homepage-header'>
            <HomepageHeader
              month={month}
              year={year}
              id={id}
              users={users}
              groups={groups}
              appDropDown={appDropDown}
              showDropDown={showDropDown}
              handleShowDropDown={handleShowDropDown}
            />
          </div>
        ) : null}
        {isGroupsGotten ? (
          <div className='homepage-groups-container' onClick={handleAppDropDown}>
            <MyGroup
              groups={groups}
              setGroups={setGroups}
              month={month}
              year={year}
              yearId={yearId}
              id={id}
              users={users}
              setUsers={setUsers}
              setAuthUser={setAuthUser}
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
              setAuthUser={setAuthUser}
            />
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default Homepage