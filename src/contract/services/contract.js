import Contract from "../models/contract.js";
import Op from "sequelize";
import User from "../../users/services/user.js";
import userService from "../../users/services/user.js";

const contractService = {
    startChat: async (chat,contractorId,providerId) => {
        const contract = await Contract.create({ providerId, contractorId, chat });
        return contract
    },
    getContract: async (contractId) => {
        const contract = await Contract.findByPk(contractId, {
            include: [
                { model: User, as: 'Contractor' },
                { model: User, as: 'Provider' },
                { model: Service, as: 'Service' }
            ]
        });
        if (!contract) throw new Error('Contract not found');
        return contract;
    },
    contractorAccept: async (contractorId,providerId) => {

        const hasOtherContract = await Contract.findOne({
            where: {
                [Op.and]:[
                    { contractorId: contractorId },
                    {ContractorAccepted: true},
                    {ContractorDone: false},
                ]
            }
        });

        if (hasOtherContract) throw new Error('You already have an active contract');
        const contract = await Contract.update({
            contractorAccepted: true,
            where: {
                [Op.and]: [
                    { contractorId: contractorId },
                    { providerId: providerId },
                    { ContractorAccepted: false },
                    { ContractorDone: false },
                    { ProviderDone: false }
                ]
            }
        })
        return contract
    },
    providerAccept: async (providerId, contractId) => {
        const contract = await contractService.getContract(contractId);
        if (!contract) throw new Error('Contract not found');
        if(contract.providerAccepted === false) throw new Error('Provider must accept the contract first');
        return await contract.update({
            providerId: providerId,
            ProviderAccepted: true
        });
    },
    contractorDone: async (contractId,rating) => {
        const contract = await contractService.getContract(contractId);
        if (!contract) throw new Error('Contract not found');
        if (contract.ContractorDone) throw new Error('Contractor has already marked the service as done');
        await contract.update({ ContractorDone: true });
        await contractService.rateUser(contract.providerId, rating); 
    },
    providerDone: async (contractId,rating) => {
        const contract = await contractService.getContract(contractId);
        if (!contract) throw new Error('Contract not found');
        if (contract.ProviderDone) throw new Error('Provider has already marked the service as done');
        await contract.update({ ProviderDone: true });
        await contractService.rateUser(contract.contractorId, rating);
    },
    rateUser: async (userId, rating) => {
        const user = await userService.fetchme(userId);
        const newRating = (user.rating + rating) / (user.numberOfRatings + 1);
        return await user.update({ rating: newRating });
    }
}