import { API_BASE } from '@/helpers/env-config';
import { ApiProject } from '@/services/api';
import { ApiType } from '@/types/ApiResponse.type';
import { ChevronRight, Eye, LockKeyhole, Settings } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

export default function ProjectCard(project: ApiType.Project) {

    const handleDelete = (id: string) => {
        const fetch = async () => {
            const response = await ApiProject.delete_(id);
        }

        fetch();
    };

    return (
        <div className='relative w-64 h-32 bg-neutral-800 border border-neutral-700 shadow-lg hover:shadow-xl transition-all shadow-neutral-950'>
            <Link href={`${API_BASE}/sandbox/${project.id}`}>
                <div className='h-full w-full border-neutral-300 pr-2 pl-4 p-3.5 cursor-pointer flex flex-col place-content-between'>
                    <div className=''>
                        <div>{project.name}</div>

                    </div>
                    <div className='flex mb-1'>
                        <div>
                            {project.visibility === "PRIVATE" ?
                                <LockKeyhole className="text-neutral-400" width={16} height={16} />
                                :
                                <Eye className="text-neutral-400" width={16} height={16} />
                            }
                        </div>
                    </div>
                </div>
            </Link>
            <div
                onClick={() => handleDelete(project.id)}
                className='absolute z-20 hover:bg-neutral-700 rounded-[3px] right-2 top-3.5 cursor-pointer'
            >
                {/* <ChevronRight className="text-neutral-200 mx-1 my-0.5 origin-right" width={18} height={18} /> */}
                <Settings className="text-neutral-200 mx-1 my-1 origin-right" width={18} height={18} />
            </div>
        </div>
    );
}
