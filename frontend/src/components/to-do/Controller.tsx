import React, { useCallback, useEffect, useState } from 'react';
import { isEqual } from 'lodash';

import CreateModal from 'components/modals/Create';

import Title from 'components/to-do/Title';

import { doFetch } from 'utils/fetch';
import { handleWrongSession, hasSession } from 'utils/session';
import create from 'utils/to-do/create';

const ToDos: React.FC = () => {
    const [toDos, setToDos] = useState([{
        email: '',
        title: '',
        deadline: '',
        parent: '',
        isCompleted: false,
        styles: {
            isBold: false,
            isItalic: false,
        }
    }]);

    /**
        * It will be checked on the backend.
        * If the sessionId is wrong / old, the user will be logged out.
    **/
    const sessionId = hasSession();

    const deadlines: string[] = [];
    toDos.map(({ deadline }) => !deadlines.includes(deadline) ? deadlines.push(deadline) : '' );

    /* Retrieve To Do's ( get ) */
    const handleRetrieve = useCallback(async () => {
        const content = await doFetch({ url: 'to-dos/' + sessionId, method: 'get' });

        /**
            * Check if the content.dues is the same as the to Dos.

            Explanation If they're the same, it means the setToDos was already called.
                * This is important since without the object check with lodash, the setToDos
                would be called infinitely.

                Problem  The useEffect and all the other dependents would also be called forever.
                Solution Adding this object comparison, calling setToDos on the first iteration
                and finishing the execution on the second call.
        **/
        if (content.dues && !isEqual(content.dues, toDos)) setToDos(content.dues);
        console.log(toDos);
        
    }, [sessionId, toDos]);

    useEffect(() => {
        if (!sessionId) handleWrongSession();
        handleRetrieve();
    }, [sessionId, handleRetrieve]);

    return (
        <div>
            <CreateModal />

            {deadlines.map(deadline => {
                return <div key={deadline}>
                    {toDos.some(object => object.parent === '' && object.deadline === deadline) && <h2>{deadline}</h2>}

                    {toDos.map((object) => {
                        if (object.deadline === deadline && object.parent === '') return (
                            <ul key={deadline + object.title}>
                                <Title sessionId={sessionId} refresh={handleRetrieve} title={object.title}
                                    children={toDos.filter(childObject => childObject.parent !== '' && childObject.parent === object.title)}
                                    isCompleted={object.isCompleted} styles={object.styles}
                                />
                            </ul>
                        )
                        else return null;
                    })}
                </div>
            })}
            <button id="add-toDos" onClick={async () => await create({ sessionId, refresh: handleRetrieve, parent: '' })}>Add To Do</button>
        </div>
    )
}

export default ToDos;