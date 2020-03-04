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
    const afterCleanup = element.json.dataNew.parties.publicKeys.map(x => x.charAt(0));
    return afterCleanup.length != afterCleanup.filter(x => Number.isNaN(Number(x))).length;
}


export class ScwPartiesIfInvalidIdentities implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw Parties - If An Identity Is Invalid',
		name: 'scwPartiesIfInvalidIdentities',
		group: ['transform'],
		version: 1,
		description: 'Continues if at least one of the identities (publicKeys) of the parties is invalid.',
		defaults: {
			name: 'Identity Is Invalid',
			color: '#772244',
		},
		inputs: ['main'],
        outputs: ['main'],
        inputNames: ['State Change'],
        outputNames: ['State Change'],
		properties: []
    };


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData();
        const result = itemsAll.filter(keep);
        
        return this.prepareOutputData(result);
	}
}
