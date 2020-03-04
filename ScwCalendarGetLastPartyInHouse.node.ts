import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';


export class ScwCalendarGetLastPartyInHouse implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Get Last Party In House',
		name: 'scwCalendarGetLastPartyInHouse',
		group: ['transform'],
		version: 1,
		description: 'Outputs the last party that stayed in the house according to an input state.',
		defaults: {
			name: 'Get Last Party',
			color: '#772244',
		},
		inputs: ['main'],
        outputs: ['main'],
        inputNames: ['State'],
        outputNames: ['Party'],
		properties: []
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData();
        const result = []

        for (let itemIndex = 0; itemIndex < itemsAll.length; itemIndex++) {
            let allNumbers = itemsAll[itemIndex].json.calendar['schedule'].map(Number).filter(Boolean);
            if (allNumbers.length == 0) {
                result.push({'json': (-1).toString()});
            }
            else {
                result.push({'json': allNumbers[allNumbers.length - 1].toString()});
            }
        }

		return this.prepareOutputData(result);
	}
}
