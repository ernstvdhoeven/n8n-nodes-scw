import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';


const DAY = 24 * 60 * 60 * 1000;

const CREDIT_PER_DAY = 100
const CREDIT_PER_FORK = 2
const CREDIT_PER_PAN = 10
const CREDIT_PER_DAY_ELEC = 5


function keep(element, index, array) {
    if (element[1].json == "")
        return true;

    return new Set(element[0].json.dataNew.parties.publicKeys).has(element[1]);
}


export class ScwPartiesIfNotPartyIsParticipant implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Party Not Participant ',
		name: 'scwPartiesIfNotPartyIsParticipant',
		group: ['transform'],
		version: 1,
		description: 'Input: State Changes, Party - Output: State Changes for which the input party is not one of the parties in the new state.',
		defaults: {
			name: 'Party Not Participantt',
			color: '#772244',
		},
		inputs: ['main'],
        outputs: ['main'],
        inputNames: ['SC', 'Party'],
        outputNames: ['SC'],
		properties: []
    };


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData(0);
        const party = this.getInputData(1);

        const zippedData = itemsAll.map((k, i) => [k, party[i]]);
        const resultZipped = zippedData.filter(keep);
        const result = resultZipped.map((k, i) => k[0]);
        
        return this.prepareOutputData(result);
	}
}
