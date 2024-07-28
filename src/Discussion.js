import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import GeneralHomeHeader from './GeneralHomeHeader';

export default function Discussion({ users }) {
    const { id, year, month, group } = useParams();
    return (
        <div>
            <GeneralHomeHeader
                id={id}
                year={year}
                month={month}
                users={users}
            />
            <div>
                {group === undefined ? `do not belong to a group` : `belongs to group ${group}`}
            </div>
        </div>
    )
}
