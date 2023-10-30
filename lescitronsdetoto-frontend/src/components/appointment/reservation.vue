<template>
    <v-container>
        <v-row>
            <v-col cols="5">
                <v-card width="610" color="lime-lighten-2">
                    <v-card-title class="justify-center text-center">
                        {{ txtTitle }}
                        <v-pagination v-if="step == 1" :total-visible="7" :length="this.pagination"
                            v-model="page"></v-pagination>
                        <div v-else-if="step == 2">
                            {{ this.selectedTimeSlot.date }} {{ this.selectedTimeSlot.time }}
                        </div>
                    </v-card-title>

                    <v-window v-model="step">

                        <v-window-item :value="1">
                            <div class="justify-left ma-2 bg-lime-lighten-4" height="400">
                                <v-row>
                                    <v-col cols="2" class="mx-2 mb-n4" bg-color="lime-lighten-4"
                                        v-for="(day, index)  in this.availability.slice(this.currentIndex, this.currentIndex + this.totalDayToDisplay)"
                                        v-bind:key="index">
                                        <p class=" justify-center text-subtitle-2" width="100">{{ day.date }}</p>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="2" class="mx-2" bg-color="lime-lighten-4"
                                        v-for="(day, index) in this.availability.slice(this.currentIndex, this.currentIndex + this.totalDayToDisplay)"
                                        v-bind:key="index">

                                        <v-virtual-scroll :items="day.block" :height="400">
                                            <template v-slot:default="{ item }">
                                                <v-btn class="my-1" @click="btnAddTime(item)">{{
                                                    item.time }}</v-btn>
                                            </template>
                                        </v-virtual-scroll>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-window-item>

                        <v-window-item :value="2">
                            <ClientVue mode="reservation" id="0" />
                        </v-window-item>

                        <v-window-item :value="3">
                            <div class="justify-left ma-2 pa-2 bg-lime-lighten-4" height="400">
                                <div v-if="this.vehicule"> Vehicule: {{ this.vehicule }}<br></div>
                                Date: {{ this.selectedTimeSlot.date }} {{ this.selectedTimeSlot.time }}<br>
                                Nom: {{ this.store.nomClient }}<br>
                                Prenom: {{ this.store.prenomClient }}<br>
                                <div v-if="this.store.telephoneClient">
                                    Telephone: {{ this.store.telephoneClient }}
                                </div>
                                <div v-if="this.store.courriel">
                                    Courriel: {{ this.store.courriel }}
                                </div><br>
                            </div>
                        </v-window-item>

                        <v-window-item :value="4">
                            <div v-if="submitted">
                                <div class="justify-left ma-2 pa-2 bg-lime-lighten-4" height="400">
                                    <div v-if="this.vehicule"> Vehicule: {{ this.vehicule }}<br></div>
                                    Date: {{ this.selectedTimeSlot.date }} {{ this.selectedTimeSlot.time }}<br>
                                    Nom: {{ this.store.nomClient }}<br>
                                    Prenom: {{ this.store.prenomClient }}<br>
                                    <div v-if="this.store.telephoneClient">
                                        Telephone: {{ this.store.telephoneClient }}
                                    </div>
                                    <div v-if="this.store.courriel">
                                        Courriel: {{ this.store.courriel }}
                                    </div><br>
                                </div>
                            </div>
                            <div v-else-if="submitting" class="text-center font-weight-bold ma-2 pa-2 bg-lime-lighten-4"
                                height="400">
                                <v-progress-circular :width="18" :size="100" color="amber"
                                    indeterminate></v-progress-circular>
                            </div>
                            <div v-else class="text-center ma-2 pa-2 bg-lime-lighten-4" height="400">
                                <p class="ma-2 font-weight-bold">ERREUR LORS DE LA SOUMISSION</p>
                                <p>{{ this.errorMsg }}</p>
                                <v-btn append-icon="mdi-sync" block @click="this.submitAppointment">Réesayer</v-btn>
                            </div>

                        </v-window-item>

                    </v-window>
                    <v-card-actions>
                        <v-btn v-if="!this.submitting && !this.submitted" bg-color="error" icon dark
                            @click="$emit('closeReservationDialog')">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-btn v-if="step > 1 && (!this.submitted && !this.submitting)" variant="text" @click="step--">
                            retour </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn v-if="step < 4" :disabled="btnNextValid" color="primary" variant="flat" @click="step++">
                            {{ txtNext }}
                        </v-btn>
                        <v-btn v-if="!this.submitting && this.submitted" bg-color="error" icon dark
                            @click="$emit('closeReservationDialog')">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>

        </v-row>
    </v-container>
</template>

  
<script>

import session from '../../session.js';
import clientVue from '../clientComponent/Client.vue';
import { saveAppointment, fetchAvailabilities } from '@/services/AvailabilityService.js';
import { createClient } from '@/services/ClientService';
import { useClientStore } from '@/store/client';

export default {
    components: {
        ClientVue: clientVue,
    },
    props: {
        vin: String,
        vehicule: String,
    },
    data() {
        return {
            step: 1,
            submitting: false,
            submitted: false,
            confirmationID: null,
            currentIndex: 0,
            session: session,
            page: 1,
            totalDayToDisplay: 5,
            availability: [],
            receivedAvailability: [],
            myAvailability: [],
            selectedTimeSlot: [],
            store: useClientStore(),
            btnNextValid: true,
            errorMsg: "",
        };
    },
    methods: {
        async getDBAvailability() {
            const response = await fetchAvailabilities();
            if (response.status === 200) {
                this.availability = JSON.parse(JSON.stringify(response.data))
            } else {
                this.availability = [];
            }
        },

        async init() {
            this.availability.splice(0, this.availability.length);
            await this.getDBAvailability();
        },
        btnAddTime(item) {
            this.selectedTimeSlot = item;
            this.step++;
        },
        NextValid() {
            if (this.step == 1) {
                return true;
            }
            if (this.step == 2) {
                return !this.formValidated;
            }
            if (this.step == 3) {
                return false;
            }
            return true;
        },
        async submitAppointment() {
    this.submitted = false;
    this.submitting = true;
    this.errorMsg = "";
    const modality = this.inline === 1 ? "email" : "phone";

    const Client = {
        modality: modality,
        nomClient: "" + this.store.nomClient,
        prenomClient: "" + this.store.prenomClient,
        posteClient: "" + this.store.posteClient,
        telephone: "" + this.store.telephoneClient,
        numeroCivic: "" + this.store.numeroCivic,
        numeroAppartement: "" + this.store.numeroAppartement,
        nomRue: "" + this.store.nomRue,
        nomVille: "" + this.store.nomVille,
        nomProvince: "" + this.store.nomProvince,
        codePostal: "" + this.store.codePostal,
        isArchive: "" + this.store.isArchive,
        courriel: "" + this.store.courriel
    };
    
    try {
        this.confirmationID = await createClient(Client);
        if (this.confirmationID.idClient) {
            const event = {
                vin: this.vin,
                idEvenement: this.selectedTimeSlot.eventId,
                idClient: this.confirmationID.idClient,
            }

            try {
                const response = await saveAppointment(event);

                console.log("RES: ", response);
                if (response.status === 200) {
                    this.submitted = true;
                    this.submitting = false;
                } else {
                    this.submitted = false;
                    this.submitting = false;
                }
            } catch (error) {
                this.submitted = false;
                this.submitting = false;
                this.errorMsg = error.message;
                console.error("Error:", error);
            }
        } else {
            this.submitted = false;
            this.submitting = false;
        }
    } catch (error) {
        this.submitted = false;
        this.submitting = false;
        this.errorMsg = error.message;
        console.error("Error in createClient:", error);
    }
}
    },
    computed: {
        pagination() {
            return Math.ceil(this.availability.length / this.totalDayToDisplay);
        },
        formValidated() {
            return this.store.isValidate;
        },
        txtNext() {
            return this.step !== 3 ? 'Suivant' : 'Envoyé';
        },
        txtTitle() {
            switch (this.step) {
                case 1:
                    return 'Sélectionner une date';
                case 2:
                    return 'Entrez vos informations';
                case 3:
                    return 'Vérification des informations';
                default:
                    return this.submitted ? 'Envoyé' : 'Confirmer';
            }
        },

    },
    watch: {
        page(newIndex, oldIndex) {
            this.currentIndex = this.totalDayToDisplay * (this.page - 1);
        },
        formValidated() {
            this.btnNextValid = this.NextValid();
        },
        step() {
            this.btnNextValid = this.NextValid();
            this.step === 4 ? this.submitAppointment() : null;
        }
    },
    mounted() {
        this.init();
    },
}

</script> 