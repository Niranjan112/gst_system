<template>
  <div class="register">
    <v-container>
        <v-layout>
            <v-flex>
                <v-card class="mx-auto" max-width="700px" outlined>
                    <v-card-title class="indigo darken-4 white--text justify-center display-1">
                        Welcome {{firstname}} {{lastname}}
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-form class="px-8 py-3 indigo lighten-5">
                        <v-text-field
                            v-model="firstname" 
                            counter="30"
                            color="indigo darken-4"
                            :error-messages="firstnameErrors" 
                            label="First Name" 
                            @input="$v.firstname.$touch()"
                            @blur="$v.firstname.$touch()">
                                
                        </v-text-field>

                        <v-text-field
                            v-model="lastname" 
                            counter="30" 
                            :error-messages="lastnameErrors" 
                            label="Last Name"
                            color="indigo darken-4"
                            @input="$v.lastname.$touch()"
                            @blur="$v.lastname.$touch()">
                                
                        </v-text-field>

                        <v-text-field
                            v-model="email"
                            :error-messages="emailErrors"
                            label="E-mail"
                            color="indigo darken-4"
                            @blur="$v.email.$touch()">
                        </v-text-field>

                        <v-text-field
                            v-model="contact_no"
                            :error-messages="contactErrors"
                            label="Phone Number"
                            counter="10"
                            color="indigo darken-4"
                            @blur="$v.contact_no.$touch()">
                        </v-text-field>

                        <v-text-field
                            v-model="walletAddress"
                            :error-messages="walletErrors"
                            label="Wallet Address"
                            color="indigo darken-4"
                            @input="$v.walletAddress.$touch()"
                            @blur="$v.walletAddress.$touch()">
                        </v-text-field>

                        <v-menu
                            v-model="menu1"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                        >
                            <template v-slot:activator="{on}">
                                <v-text-field
                                    :value="formattedDate"
                                    label="Date of Birth"
                                    hint="DD/MM/YYYY format"
                                    color="indigo darken-4"
                                    persistent-hint
                                    readonly
                                    clearable
                                    v-on="on"
                                >
                                </v-text-field>
                            </template>
                            <v-date-picker 
                                v-model="date" 
                                @input="menu1 = false"
                                color="indigo darken-4"
                                no-title
                            ></v-date-picker>
                        </v-menu>

                        <div class="text-center">
                            <v-btn 
                                x-large class="indigo darken-4 white--text ma-2" 
                                @click="submit">
                                Submit
                                </v-btn>
                            <v-btn 
                                x-large 
                                class="indigo darken-4 white--text ma-2" 
                                @click="clear">
                                Reset Form
                            </v-btn>
                        </div>
                    </v-form>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
  </div>
</template>
<script>
import { validationMixin } from 'vuelidate'
import format from 'date-fns/format'
import { required, maxLength, email, alpha, numeric } from 'vuelidate/lib/validators'
    const phone_no = (value) => value.length == 10
    export default {
        mixins: [validationMixin],

        validations: {
            firstname: {required, maxLength: maxLength(30), alpha},
            lastname: {required, maxLength: maxLength(30), alpha},
            email: {required, email},
            contact_no: {required, maxLength: maxLength(10), numeric, phone_no},
            walletAddress: {required, maxLength: maxLength(10)}
        },

        data() {
            return {
                firstname: '',
                lastname: '',
                email: '',
                contact_no: '',
                walletAddress: '',
                date: null,
                menu1: false,
            }
        },

        computed: {
            firstnameErrors() {
                const errors = []
                if (!this.$v.firstname.$dirty) return errors
                !this.$v.firstname.maxLength && errors.push('First name must be at most 30 characters long')
                !this.$v.firstname.required && errors.push('First name is required.')
                !this.$v.firstname.alpha && errors.push('First name should not contain numbers')
                return errors
            },

            lastnameErrors() {
                const errors = []
                if (!this.$v.lastname.$dirty) return errors
                !this.$v.lastname.maxLength && errors.push('Last name must be at most 30 characters long')
                !this.$v.lastname.required && errors.push('Last name is required.')
                !this.$v.firstname.alpha && errors.push('Last name should not contain numbers')
                return errors
            },

            emailErrors() {
                const errors = []
                if (!this.$v.email.$dirty) return errors
                !this.$v.email.email && errors.push('Must be valid e-mail')
                !this.$v.email.required && errors.push('E-mail is required')
                return errors
            },

            contactErrors() {
                const errors = []
                if (!this.$v.contact_no.$dirty) return errors
                !this.$v.contact_no.required && errors.push('Phone number is required')
                !this.$v.contact_no.numeric && errors.push('Phone number must be numeric')
                !this.$v.contact_no.phone_no && errors.push('Phone number must have exact 10 numbers')
                return errors
            },

            walletErrors() {
                const errors = []
                if (!this.$v.walletAddress.$dirty) return errors
                !this.$v.walletAddress.maxLength && errors.push('Address must be at most 10 characters long')
                !this.$v.walletAddress.required && errors.push('Wallet address is required')
                return errors
            },

            formattedDate() {
                return this.date ? format(new Date(this.date), 'do MMM yyyy') : ''
            }
        },

        methods: {
            submit() {
                this.$v.$touch()
            },

            clear() {
                this.$v.$reset()
                this.firstname = ''
                this.lastname = ''
                this.email = ''
                this.contact_no = ''
                this.walletAddress = ''
                this.date = null
            },
        }
    }
</script>
