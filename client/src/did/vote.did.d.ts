import type { Principal } from '@dfinity/principal';
export type Allotment = [Principal, number];
export interface Canister {
  'createList' : (arg_0: ProposalID, arg_1: Array<Allotment>) => Promise<
      Result
    >,
  'createProposal' : (arg_0: string, arg_1: GenericType) => Promise<Result>,
  'deleteProposal' : (arg_0: ProposalID) => Promise<Result>,
  'getVotes' : (arg_0: ProposalID) => Promise<Result_2>,
  'readList' : (arg_0: ProposalID) => Promise<[] | [Array<Allotment>]>,
  'readProposal' : (arg_0: ProposalID) => Promise<[] | [Proposal]>,
  'readProposals' : () => Promise<Array<Proposal>>,
  'updateProposal' : (
      arg_0: ProposalID,
      arg_1: [] | [string],
      arg_2: [] | [GenericType],
    ) => Promise<Result_1>,
  'vote' : (arg_0: ProposalID, arg_1: GenericValue) => Promise<Result>,
}
export type Error = { 'ProposalNotFound' : [] | [string] } |
  { 'VoteMax' : [] | [string] } |
  { 'Unauthorized' : null } |
  { 'VoteUnauthorized' : [] | [string] } |
  { 'VoteWrongType' : [] | [string] };
export type GenericType = { 'Nat64Content' : null } |
  { 'Nat32Content' : null } |
  { 'BoolContent' : null } |
  { 'Nat8Content' : null } |
  { 'Int64Content' : null } |
  { 'IntContent' : null } |
  { 'NatContent' : null } |
  { 'Nat16Content' : null } |
  { 'Int32Content' : null } |
  { 'Int8Content' : null } |
  { 'Int16Content' : null } |
  { 'BlobContent' : null } |
  { 'Principal' : null } |
  { 'TextContent' : null };
export type GenericValue = { 'Nat64Content' : bigint } |
  { 'Nat32Content' : number } |
  { 'BoolContent' : boolean } |
  { 'Nat8Content' : number } |
  { 'Int64Content' : bigint } |
  { 'IntContent' : bigint } |
  { 'NatContent' : bigint } |
  { 'Nat16Content' : number } |
  { 'Int32Content' : number } |
  { 'Int8Content' : number } |
  { 'Int16Content' : number } |
  { 'BlobContent' : Array<number> } |
  { 'Principal' : Principal } |
  { 'TextContent' : string };
export interface Proposal {
  'id' : ProposalID,
  'title' : string,
  'voteType' : GenericType,
}
export type ProposalID = number;
export type Result = { 'ok' : null } |
  { 'err' : Error };
export type Result_1 = { 'ok' : [] | [Proposal] } |
  { 'err' : Error };
export type Result_2 = { 'ok' : Array<Vote> } |
  { 'err' : Error };
export type Vote = [ProposalID, Principal, GenericValue];
export interface _SERVICE extends Canister {}
