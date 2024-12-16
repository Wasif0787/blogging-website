import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const SkeletonGrid = () => {
    return (
        <div className="grid gap-4 p-7 
                        grid-cols-1 
                        sm:grid-cols-2 
                        md:grid-cols-3 
                        lg:grid-cols-4 
                        xl:grid-cols-5">
            {Array.from({ length: 20 }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    )
}

const SkeletonCard = () => {
    return (
        <div className="flex flex-col space-y-3 w-full">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    )
}

export default SkeletonGrid
