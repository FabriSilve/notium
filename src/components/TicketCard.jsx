/* eslint-disable react/prop-types */
import { useCallback, useEffect,  useState } from "react";
import {
    Accordion,
    AccordionHeader,
    AccordionBody
  } from '@tremor/react';

  import { ArcherContainer, ArcherElement } from 'react-archer';


export const TicketCard = ({ticket, allTickets}) => {
    const [dependencies, setDependencies] = useState()
    
    const getDependencies = useCallback((deps) => {
        const dependencies = [];
        deps.forEach((id) => {
          const foundDependencies = allTickets.filter((ticket) => ticket.id === id);
          if (foundDependencies.length > 0) dependencies.push(...foundDependencies)
        })
    
        return dependencies
      }, [allTickets])

      useEffect(() => {
        if(!dependencies) {
            setDependencies(getDependencies(ticket.dependencies))
        }
      }, [dependencies, getDependencies, ticket.dependencies])

      const getItem = (id) => {
        const ticket = allTickets.filter((it) => it.id === id);
        
        // Documentation: https://github.com/pierpo/react-archer?tab=readme-ov-file
        return ticket.map((tick) => (
            <ArcherElement
            key={`inner-${tick.id}`} 
            id={`inner-${tick.id}`} 
            relations={undefined}>
             <div className="border-2 border-black-500 p-2 w-fit">{tick.title}</div>
            </ArcherElement>
        ))
      }

    // Should perhaps add an useCallback around this, so it doesn't get called every render
    const getRelations = () => {
        return dependencies?.map((dep) => ({
            targetId: `inner-${dep.id}`,
            targetAnchor: 'top',
            sourceAnchor: 'bottom',  
            style: { strokeColor: 'blue', strokeWidth: 1, lineStyle: "curve" },
        }))
    }

    if(!dependencies?.length) return <></>

    return (        
    <Accordion >
      <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        <div className="flex w-full justify-between">
           <h3> {ticket.title} </h3>
           <p className="">{dependencies?.length}</p>
        </div>
      </AccordionHeader>
      <AccordionBody className="leading-6 m-2">
        <div className="flex flex-col gap-2">
            <ArcherContainer strokeColor="red" >
                <ArcherElement
                    id="root"
                    relations={getRelations()}
                >
                    <div className=" border-2 border-black p-2 w-fit">{ticket.title}</div>
                </ArcherElement>
          
            <div className="flex gap-2 mt-10">
                {dependencies?.map((dep) => getItem(dep.id))}
            
            </div>
            </ArcherContainer>
        </div>
      </AccordionBody>
    </Accordion>
    )
}