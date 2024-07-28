import { useParams } from 'react-router-dom';
import GeneralHomeHeader from './GeneralHomeHeader';

export default function FileSharing({ users }) {
    const { id, year, month, group, members, project_name } = useParams();
    return (
        <div>
            <GeneralHomeHeader
                id={id}
                year={year}
                month={month}
                users={users}
                member={members ? members : ""}
                project_name={project_name ? project_name: ""}
            />
            <div>
                {group === undefined ? `do not belong to a group` : `belongs to group ${group}`}
            </div>
            <div>
                file sharing
            </div>
        </div>
    )
}
