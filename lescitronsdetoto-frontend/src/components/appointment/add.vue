<template>
    <v-container v-if="session.user">
        <v-row>
            <v-col cols="6">
                <v-card width="600" color="lime-lighten-2" class="mr-8">
                    <v-card-title class="justify-center text-center">
                        Plage de disponibilités
                        <v-pagination :total-visible="7" :length="this.pagination" v-model="page"></v-pagination>
                    </v-card-title>

                    <div class="justify-left ma-2 bg-lime-lighten-4" width="500">
                        <v-row>
                            <v-col cols="2" class="mx-2 mb-n6" bg-color="lime-lighten-4"
                            v-for="(day, index)  in this.availability.slice(this.currentIndex, this.currentIndex + this.totalDayToDisplay)"
                            height="360">
                            <p class=" justify-center text-subtitle-2" width="110">{{ day.date
                            }}</p>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="2" class="mx-2 mb-2" bg-color="lime-lighten-4"
                            v-for="(day, index)  in this.availability.slice(this.currentIndex, this.currentIndex + this.totalDayToDisplay)">
                        <v-list class="bg-transparent" width="100" height="360">
                            <v-list-item-title class="my-n1" style="position: sticky; top: 0;"><br/></v-list-item-title>
                            <v-checkbox class="my-n10" v-for="block in day.block" v-model="selectedTimeSlot"
                                :value="{ date: block.date, time: block.time, status: block.status }"   
                                :label="block.time"></v-checkbox>
                        </v-list>
                    </v-col>
                    </v-row>
                    </div>
                    <div class="text-right">
                        <v-btn variant="text" class="ma-2 mx-6" :disabled="!selectedTimeSlot.length >= 1"
                    @click="this.addTimeSlot(selectedTimeSlot, myAvailability, availability)"
                    icon="mdi-arrow-right-bold-box-outline" />
                    </div>
                </v-card>
            </v-col>
            <v-col cols="6">
                <v-card width="605" color="light-green-lighten-2" class="ml-8">
                    <v-card-title class="justify-center text-center">
                        Mes disponibilités
                        <v-pagination :total-visible="7" :length="this.myPagination" v-model="myPage"></v-pagination>
                    </v-card-title>
                    <div class="justify-left ma-2 bg-light-green-lighten-4" width="500">
                        <v-row>
                            <v-col cols="2" class="mx-2 mb-n6" bg-color="lime-lighten-4"
                            v-for="(day, index)  in this.myAvailability.slice(this.myCurrentIndex, this.myCurrentIndex + this.totalDayToDisplay)"
                            height="360">
                            <p class=" justify-center text-subtitle-2" width="110">{{ day.date
                            }}</p>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="2" class="mx-2 mb-2" bg-color="lime-lighten-4"
                            v-for="(day, index)  in this.myAvailability.slice(this.myCurrentIndex, this.myCurrentIndex + this.totalDayToDisplay)">
                        <v-list class="bg-transparent" width="100" height="360">
                            <v-list-item-title class="my-n1" style="position: sticky; top: 0;"><br/></v-list-item-title>
                            <v-checkbox class="my-n10" v-for="block in day.block" v-model="toRemoveTimeSlot"
                                :value="{ date: block.date, time: block.time, status: block.status }"   
                                :label="block.time"></v-checkbox>
                        </v-list>
                    </v-col>
                    </v-row>
                    </div>

                    <v-btn variant="text" class="ma-2 mx-6" :disabled="!toRemoveTimeSlot.length >= 1"
                    @click="this.addTimeSlot(toRemoveTimeSlot, availability, myAvailability)"
                    icon="mdi-arrow-left-bold-box-outline" />
                    <v-btn color="green-darken-1" prepend-icon="mdi-file-send" :disabled="!canSubmit" class=" ma-1" @click="submit">Soumettre</v-btn>

                </v-card>
            </v-col>

        </v-row>
    </v-container>
    <v-container v-else class="ma-2">Vous n'avez pas les permissions pour voir cette page</v-container>

</template>

  
<script>

import session from '../../session.js';
import { saveAvailability, fetchAvailability } from '@/services/AvailabilityService.js';
export default {
    data() {
        return {
            canSubmit: false,
            currentIndex: 0,
            myCurrentIndex: 0,
            session: session,
            startTime: 9,
            endTime: 20,
            page: 1,
            myPage: 1,
            totalDayToDisplay: 5,
            totalDays: 15,
            availability: [],
            receivedAvailability: [],
            myAvailability: [],
            removedAvailability: [],
            timeBlock: 60,
            selectedTimeSlot: [],
            toRemoveTimeSlot: [],
        };
    },
    methods: {
        async generateAvailability() {

            for (let i = 0; i < this.totalDays; i++) {
                let day = new Date();
                day.setDate(day.getDate() + i);
                let dayArray = [];

                dayArray = (this.generateTimeArray(this.startTime, this.endTime, this.timeBlock, day));

                const dayObj = {
                    date: (day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate().toString().padStart(2, '0')),
                    block: dayArray,
                };
                this.availability.push(dayObj);
            }
        },

        generateTimeArray(startTime, endTime, timeBlock, day) {
            let timeArray = [];
            let currentTime = new Date();
            currentTime.setHours(startTime);
            currentTime.setMinutes(0);
            while (currentTime.getHours() < endTime) {
                let hours = currentTime.getHours();
                let minutes = currentTime.getMinutes();

                let timeString = {
                    date: (day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate().toString().padStart(2, '0')),
                    time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
                    status: 'new'
                }

                if (currentTime.getTime() > new Date().getTime() || day.getTime() > new Date().getTime()) {
                    timeArray.push(timeString);
                }

                currentTime.setMinutes(currentTime.getMinutes() + timeBlock);
            }
            return timeArray;
        },

        addTimeSlot(inputArray, outputArray, arrayToClean) {
            (this.canSubmit === false) ? this.canSubmit = true : null;
            var output = outputArray.reduce((acc, curr) => {
                acc[curr.date] = curr.block;
                return acc;
            }, {});

            inputArray.forEach(item => {
                let date = item.date;

                if (!output[date]) {
                    output[date] = [];
                }

                if (!output[date].some(block => block.time === item.time)) {

                    output[date].push(item);
                }
            });

            outputArray.splice(0, outputArray.length, ...Object.keys(output).map(date => ({ date: date, block: output[date] })));

            outputArray.forEach(day => {
                day.block.sort((a, b) => {
                    return a.time.localeCompare(b.time);
                });
            });

            outputArray.sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
            });

            this.removeFromAvailability(arrayToClean, outputArray);
            inputArray.splice(0, inputArray.length);

            this.canSubmit = !this.isOriginal();
        },

        removeFromAvailability(arrayToClean, inputArray) {
            let newArray = arrayToClean.map(day => {
                let myDay = inputArray.find(d => d.date === day.date);
                if (myDay) {
                    return {
                        ...day,
                        block: day.block.filter(timeBlock => !myDay.block.some(myTimeBlock => myTimeBlock.time === timeBlock.time))
                    };
                }
                return day;
            }).filter(day => day.block.length > 0);

            arrayToClean.splice(0, arrayToClean.length, ...newArray);
        },

        async submit() {
            const submitAvailability = {
                toRemove: this.availability.flatMap(day => day.block.filter(block => block.status === "old")),
                toAdd: this.myAvailability.flatMap(day => day.block.filter(block => block.status === "new"))
            }
            await saveAvailability(submitAvailability).then(async () => {
                await this.init();
            })
        },

        isOriginal() {
            return JSON.stringify(this.myAvailability) === JSON.stringify(this.receivedAvailability);
        },

        cleanPast(array) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            array.forEach(day => {
                day.block = day.block.filter(timeBlock => {
                    const blockDate = new Date(day.date);
                    const blockTime = new Date(`${day.date} ${timeBlock.time}`);

                    return blockDate > today || (blockDate.getTime() === today.getTime() && blockTime > now);
                });
            });

            array.forEach(day => {
                if (day.block.length === 0) {
                    const index = array.indexOf(day);
                    if (index > -1) {
                        array.splice(index, 1);
                    }
                }
            });
        },

        async getDBAvailability() {
            const response = await fetchAvailability();
            if (response.status === 200) {
                this.receivedAvailability = JSON.parse(JSON.stringify(response.data))
                this.myAvailability = JSON.parse(JSON.stringify(this.receivedAvailability));
            } else {
                this.receivedAvailability = [];
                this.myAvailability = [];
            }
        },

        async init() {
            this.availability.splice(0, this.availability.length);
            await this.generateAvailability().then(() => {
                this.cleanPast(this.availability);
            })
            await this.getDBAvailability().then(() => {
                this.removeFromAvailability(this.availability, this.myAvailability);
                this.cleanPast(this.myAvailability);
            })

        },
    },
    computed: {
        pagination() {
            return Math.ceil(this.availability.length / this.totalDayToDisplay);
        },
        myPagination() {
            return Math.ceil(this.myAvailability.length / this.totalDayToDisplay);
        }
    },
    watch: {
        page(newIndex, oldIndex) {
            this.currentIndex = this.totalDayToDisplay * (this.page - 1);
        },
        myPage(newIndex, oldIndex) {
            this.myCurrentIndex = this.totalDayToDisplay * (this.myPage - 1);
        }
    },
    mounted() {
        this.init();
    },
}

</script> 