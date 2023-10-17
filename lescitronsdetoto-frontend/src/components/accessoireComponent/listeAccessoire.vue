

<script>

import { useAccessoireStore } from '@/store/accessoire';
import session from '@/session';

export default {

    data() {
        return {
            accessoireStore: useAccessoireStore(),
            colors: ['#2196F3', '#90CAF9', '#64B5F6', '#42A5F5', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1', '#82B1FF', '#448AFF', '#2979FF', '#2962FF'],
            loading: true,
            loadError: false,
            session: session
        };
    },
    methods: {
        genRandomIndex(length) {
            return Math.ceil(Math.random() * (length - 1))
        },
        rafraichirAccessoires() {
            this.accessoireStore.getAccessoires();
        }

    },

    computed: {

        items() {

            const colorsLength = this.colors.length
            let num = 0

            return Array.from({ length: this.accessoires.length }, () => {


                const name = this.accessoires[num].nomAccessoire
                const id = this.accessoires[num].idAccessoire
                num++
                return {
                    color: this.colors[this.genRandomIndex(colorsLength)],
                    name: `${name} `,
                    idAccessoire: `${id}`

                }
            });
        },
        accessoires() {
            return this.accessoireStore.accessoires;
        }
    },
    mounted() {

        this.accessoireStore.getAccessoires();

    },


}
</script>

