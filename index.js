$(document).ready(function () {

    const STORE = {
        searchTerm: '',
        data: null,
        api_key: '3800867fcd4fc608e503fe922a96c054',
        currentIndex: null,
        page: 1,
    };

    const API_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';

    function getDataFromApi(searchTerm, callback) {
        const query = {
            api_key: STORE.api_key,
            query: searchTerm,
            page: STORE.page
        };

        $.getJSON(API_SEARCH_URL, query, function (response) {
            let message;
            if (response.total_results === 0) {
                $('.js-movie-result-page').addClass('hidden');
                message = `No results found for "${searchTerm}"`;
            }
            else {
                STORE.data = response;
                callback();
                $('.js-movie-result-page').removeClass('hidden');
                message = `${response.total_results} results found for "${searchTerm}"`;
            }
            displayFeedbackMessage(message);
        });
    }

    function displayFeedbackMessage(message) {
        $('#feedback').html(message)
    }

    function displaySearchResult() {
        const data = STORE.data;
        const results = data.results.map((item) => {
            return renderSearchResult(item);
        });
        $('.js-movie-result-list').html(results);
        // incomplete validation
        if (STORE.data.total_pages > 1) {
            $('.page_count').removeClass('hidden');
            $('.page_counter').html(STORE.page);
        } else {
            $('.page_count').addClass('hidden');
        }
    }

    function renderSearchResult(item) {
        if (item.poster_path !== null) {
            return `
                <li id=${item.id} class='search_result'>
                    <h3><strong>${item.title}</strong></h3>
                    <img class='js-movie-poster' src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt=${item.title}/>
                    <div class="movie_details">
                        <p><strong>Average Rating</strong>: ${item.vote_average}</p>
                        <p><strong>Release Date</strong>: ${item.release_date}</p>
                        <p><strong>Overview:</strong> ${item.overview}</p>
                    </div>
                </li>
            `;
        }
    }

    // incomplete
    $(function displayMovieDetails() {
        $('.js-movie-result-page').on('click', '.js-movie-poster', event => {
            $(event.target).parent().addClass('card_hover');
            $('.overlay').show();

        })
        $('.overlay').on('click', event => {
            $('.card_hover').removeClass('card_hover');
            $('.overlay').hide();
        })
        $('close').on('click', event => {
            $('.card_hover').removeClass('card_hover');
            $('.overlay').hide();
        })
    })

    $('.js-search-form').submit(event => {
        event.preventDefault();
        // edge case input validation
        const queryTarget = $(event.currentTarget).find('.js-query');
        const query = queryTarget.val();
        STORE.searchTerm = query;
        queryTarget.val();
        STORE.page = 1;
        getDataFromApi(query, displaySearchResult);
        $('.js-movie-result-page').removeAttr('hidden');
        $('.previous_page').prop('disabled', true);
        $('.next_page').prop('disabled', false);
    });

    $('.js-query').keyup(event => {
        if (event.target.value.length > 0) {
            $('#search_button').prop('disabled', false);
        } else { $('#search_button').prop('disabled', true); }
    })

    $('.previous_page').click(event => {
        if (STORE.page > 1) {
            STORE.page--;
            getDataFromApi(STORE.searchTerm, displaySearchResult);
            console.log(STORE.page);
            if (STORE.page === 1) {
                $('.previous_page').prop('disabled', true);
            }
            $('.next_page').prop('disabled', false);
        } else {
            $('.previous_page').prop('disabled', true);
        }
    })

    $('.next_page').click(event => {
        if (STORE.page < STORE.data.total_pages) {
            STORE.page++;
            getDataFromApi(STORE.searchTerm, displaySearchResult);
            if (STORE.page >= STORE.data.total_pages) {
                $('.next_page').prop('disabled', true);
            }
            $('.previous_page').prop('disabled', false);
        } else {
            $('.next_page').prop('disabled', true);
        }
    })
})