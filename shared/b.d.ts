interface IParticipant {
    name: string
    url: string
    pos: number
    username: string
}

type FullRowEvent = SingleEvent & {
    participantsActiveCount: number
    participantsList: Record<string, IParticipant>
    participantsCanceled: Record<string, IParticipant>
    participantsErrors: IParticipant[]
}