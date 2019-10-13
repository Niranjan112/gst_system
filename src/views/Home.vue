<template>
    <div>
        <div class="pa-4">
            <v-responsive>
                <v-img
                src="../assets/gst_main.jpg"
                alt="gst_main"
                width="100%"
            ></v-img>
            </v-responsive>
        </div>
        
        <v-container grid-list-md text-xs-center>
            <v-layout row wrap>
                <v-flex>
                    <v-card flat max-width="344" class="mx-auto" outlined>
                        <v-card-title class="indigo darken-4 white--text justify-center">
                            News | Updates | Events
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text class="indigo lighten-5">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius vitae quod mollitia corporis exercitationem doloribus, laboriosam inventore similique, nostrum, fugit soluta perferendis sunt aperiam! Illo consequatur beatae magni iure dolorum?
                        </v-card-text>
                    </v-card>
                </v-flex>

                <v-flex>
                    <v-card flat width="700" class="mx-auto" outlined>
                        <v-card-title class="indigo darken-4 white--text text-center">
                            Popular Helpful Topics
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text class="indigo lighten-5">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto officiis quod consequuntur enim cum non pariatur molestiae aperiam aliquam distinctio incidunt, magnam vero sed. Commodi omnis mollitia impedit fuga quas.
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>

export default {

};
</script>
