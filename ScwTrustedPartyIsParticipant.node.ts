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
    return new Set(element[1].json).has(element[0].json.dataNew.trustedParty.publicKey);
}


export class ScwTrustedPartyIsParticipant implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw Trusted Party - Is Participant',
		name: 'scwTrustedPartyHasChanged',
		group: ['transform'],
		version: 1,
		description: 'Continues if the trusted party .',
		defaults: {
			name: 'Trusted Party Is Participant',
			color: '#772244',
		},
		inputs: ['main', 'main'],
        outputs: ['main'],
        inputNames: ['State Change', 'Parties'],
        outputNames: ['State Change'],
		properties: []
    };


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData(0);
        const parties = this.getInputData(1);

        const zippedData = itemsAll.map((k, i) => [k, parties[i]]);
        const resultZipped = zippedData.filter(keep);
        const result = resultZipped.map((k, i) => k[0]);
        
        return this.prepareOutputData(result);
	}
}
