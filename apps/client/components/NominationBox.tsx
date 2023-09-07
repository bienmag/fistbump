'use client'

import * as React from 'react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { mutations } from '@/lib/graphql-queries'
import { useMutation } from '@apollo/client'
import usePeerReviews from '@/app/dashboard/(user)/usePeerReviews'
import { capitalizeName } from '@/lib/utils'
import { Report, User } from '@/src/__generated__/graphql'

export const revalidate = 0
export const fetchCache = 'force-no-cache'

export type NominationBoxProps = {
  users: User[],
  loggedUserId: string,
  cycleId: string,
  report: Report,
}

export default function NominationBox({ users, loggedUserId, cycleId, report }: NominationBoxProps) {
  const peerReviews = report.reviews.peers
  const [toNominate, nominatedIds, setPeerReviews] = usePeerReviews(peerReviews)
  const [open, setOpen] = React.useState<boolean>(false)
  const [name, setName] = React.useState<string>()
  const [peerId, setPeerId] = React.useState<string>()

  const [updatePeerReviews] = useMutation(mutations.UPDATE_PEER_REVIEWS)

  async function handleNominatePeer() {
    const variables = {
      targetId: loggedUserId,
      cycleId: cycleId,
      input: { newReviewerId: peerId },
    }
    const { data: { updatePeerReviewerId: { reviews: { peers } } } } = await updatePeerReviews({ variables })
    setPeerReviews(peers)
    setPeerId('')
    setName('')
  }

  return (
    (toNominate <= 0 ? <div className="pt-12">Nominations complete!</div> :

      <div className="pt-12 flex gap-2">
        <Popover open={open} onOpenChange={() => setOpen(!open)} >
          <PopoverTrigger asChild>
            <Button
              disabled={toNominate <= 0}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="px-2 w-[200px] justify-between rounded-sm"
            >
              {name
                ? name
                : "Select a peer"}

              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Find a peer" className="h-9" />
              <CommandEmpty>No peer found</CommandEmpty>
              <CommandGroup>
                {users.map((user) => {
                  if (nominatedIds?.includes(user._id)) return
                  return (
                    <CommandItem
                      key={user._id}
                      className={peerId === user._id ? 'bg-slate-50' : ''}
                      onSelect={(currentName) => {
                        const capitalized = capitalizeName(currentName)
                        setName(capitalized)
                        setPeerId(user._id)
                        setOpen(false)
                      }}
                    >
                      {user.fullName}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4 opacity-100",
                          name === user.fullName ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <Button disabled={toNominate <= 0} onClick={handleNominatePeer}>Nominate</Button>
      </div>
    ))
}