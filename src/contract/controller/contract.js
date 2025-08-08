import contractService from '../services/contract.js';


const contractController = {
    startChat: async (req, res) => {
        try {
            const { contractorId, providerId } = req.body;
            const contract = await contractService.startChat(contractorId, providerId);
            res.status(201).send(contract);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    },
    getContract: async (req, res) => {
        try {
            const { contractId } = req.body;
            const contract = await contractService.getContract(contractId);
            res.status(200).send(contract);
        } catch (error) {
            res.status(404).send({ error: error.message });
        }
    },
    acceptContract: async (req, res) => {
        try {
            const { providerId } = req.body;
            const loggedUser = req.user;
            if(loggedUser.role !== 'Contractor') {
                const contract = await contractService.contractorAccept(loggedUser.id, providerId);
                res.status(200).send(contract);
            } else {
                const contract = await contractService.providerAccept(loggedUser.id, providerId);
                res.status(200).send(contract);
            }
            res.status(200).send(contract);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    },
    markAsDone: async (req, res) => {
        try {
            const { contractId, rating } = req.body;
            const loggedUser = req.user;
            if(loggedUser.role !== 'Contractor') {
                const contract = await contractService.contractorDone(contractId, rating);
                res.status(200).send(contract);
            } else {
                const contract = await contractService.providerDone(contractId, rating);
                res.status(200).send(contract);
            }
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }
}

export default contractController;