import { API_BASE } from '@/helpers/env-config';
import { ApiType } from '@/types/ApiResponse.type';
import { ChevronRight, Eye, LockKeyhole, Settings } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

export default function ProjectCard(project: ApiType.Project) {
    return (
        <div className='w-64 h-32 bg-neutral-800 border border-neutral-700 shadow-lg hover:shadow-xl transition-all shadow-neutral-950'>
            <Link href={`${API_BASE}/sandbox/${project.name}`}>
                <div className='h-full w-full border-neutral-300 pr-2 pl-4 p-3.5 cursor-pointer flex flex-col place-content-between'>
                    <div className='relative'>
                        <div>{project.name}</div>
                        <div className='absolute hover:bg-neutral-800 rounded-[3px] right-0 top-0'>
                            {/* <ChevronRight className="text-neutral-200 mx-1 my-0.5 origin-right" width={18} height={18} /> */}
                            <Settings className="text-neutral-200 mx-1 my-1 origin-right" width={18} height={18} />
                        </div>
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
        </div>
    );
}
