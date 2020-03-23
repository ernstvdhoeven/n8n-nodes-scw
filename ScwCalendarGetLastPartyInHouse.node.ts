import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';


export class ScwCalendarGetLastPartyInHouse implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Get Last Occupant',
		name: 'scwCalendarGetLastPartyInHouse',
		group: ['transform'],
		version: 1,
		description: 'Input: State - Output: Party that was the last occupant of the house according to the input state.',
		defaults: {
			name: 'Get Last Occupant',
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
