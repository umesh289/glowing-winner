import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Use the appropriate icon library
import { StatusBar } from 'react-native';
import { useState, useEffect, useCallback } from 'react'; // Import React and React hooks


const HomeScreen = () => {

    type QuestionData = {
        type: string;
        id: number;
        playlist: string;
        description: string;
        image: string;
        question: string;
        options: {
          id: string;
          answer: string;
        }[];
        user: {
          name: string;
          avatar: string;
        };
    };

    // Define an array of icons and text for the side gallery
    const sideGalleryIcons = [
    { name: 'list-alt', text: '' },
    { name: 'heart', text: '14' },
    { name: 'comments', text: '5' },
    { name: 'bookmark', text: '6' },
    { name: 'share', text: '12' },
    ];

    
    const [timeSpent, setTimeSpent] = useState(0);
    const [questionData, setQuestionData] = useState<QuestionData | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null); 
    const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null); 
    const [cachedQuestions, setCachedQuestions] = useState<QuestionData[]>([]); // Store cached questions
    const [currentIndex, setCurrentIndex] = useState(0); // Initialize scroll position state
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        // Start a timer when the component mounts
        const intervalId = setInterval(() => {
          setTimeSpent((prevTime) => prevTime + 1); // Increment time every second
        }, 1000); // Update every 1000ms (1 second)
    
        // Clean up the timer when the component unmounts or user leaves the screen
        return () => {
          clearInterval(intervalId);
        };
    }, []);


    useEffect(() => {
        fetch('https://cross-platform.rp.devfactory.com/for_you')
      .then((response) => response.json())
          .then((data) => {
            console.log("useEffect: ", data.id);
            console.log("useEffect: ", data.question);
            setCurrentIndex(0);

        setQuestionData(data);
        setCachedQuestions((prevCachedQuestions) => [...prevCachedQuestions, data]); // Add to cache


      })
      .catch((error) => {
        console.error('Error fetching question:', error);
      });
    }, []);
    
      
    useEffect(() => {
        if (selectedOption !== null) {
          // Fetch the correct answer from the API
          fetch(`https://cross-platform.rp.devfactory.com/reveal?id=${questionData.id}`)
            .then((response) => response.json())
            .then((data) => {
              // Compare the user's selected option with the correct answer
               console.log("Answer JSON: ", data);

                const correctAnswer = data.correct_options;
                console.log("Answer correct: ", correctAnswer);

                console.log("Answer, text: ", correctAnswer[0].answer);
                console.log("SelectedOption: ", selectedOption);

              const isCorrect = selectedOption === correctAnswer[0].id;
              setIsCorrectAnswer(isCorrect);
            })
            .catch((error) => {
              console.error('Error fetching correct answer:', error);
              setIsCorrectAnswer(false); // Assume the answer is incorrect on error
            });
        }
    }, [selectedOption, questionData]);
    
    const timeSpentInMinutes = Math.floor(timeSpent / 60); 
    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
    };

      // Define a function to fetch questions from the API
  const fetchQuestionFromAPI = useCallback(async () => {
    try {
      const response = await fetch('https://cross-platform.rp.devfactory.com/for_you');
      const data = await response.json();
      setQuestionData(data);
      setCachedQuestions((prevCachedQuestions) => [...prevCachedQuestions, data]); // Add to cache
      console.log('current id is: ', data.id);
      console.log('question is: ', data.question);

    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
    
    // Function to fetch the next question from the cache based on the current index
  const fetchNextQuestionFromCache = () => {
    setIsCorrectAnswer(null);
    setSelectedOption(null);
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);

                if (nextIndex < cachedQuestions.length) {
                    setQuestionData(cachedQuestions[nextIndex]);
                    console.log('fetchNextQuestionFromCache: IF');

                    console.log('fetchNextQuestionFromCache: currentIndex = ', currentIndex);

                  console.log('fetchNextQuestionFromCache: questionData =', questionData);

                } else {
                  setIsLoading(true);

                    // If no more questions in cache, fetch from the API
                    console.log('fetchNextQuestionFromCache: ELSE');

                    console.log('fetchNextQuestionFromCache: ', currentIndex);

                  fetchQuestionFromAPI();

                }
            

      
  };
    
    // Function to fetch the previous question from the cache based on the current index
    const fetchPreviousQuestionFromCache = () => {
      setIsCorrectAnswer(null);
      setSelectedOption(null);
      const previousIndex = currentIndex - 1;
      if (previousIndex >= 0) {
        console.log('fetchPreviousQuestionFromCache: ', previousIndex);

        setCurrentIndex(previousIndex);
        setQuestionData(cachedQuestions[previousIndex]);
      }
      
  };

    
      return (
        <ImageBackground
          source={require('../assets/background.jpeg')}
          style={styles.backgroundImage}>
          <View style={styles.container}>
            <StatusBar barStyle='light-content' />
            <View style={styles.topBar}>
              <View style={styles.clockContainer}>
                <TouchableOpacity style={styles.iconContainer}>
                  <Icon name="clock-o" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.timer}>{timeSpentInMinutes}m</Text>
              </View>
              <View style={styles.titleContainer}>
                <View style={styles.titleTextContainer}>
                  <Text style={styles.title}>For You</Text>
                </View>
                <View style={styles.titleUnderline} />
              </View>
              <TouchableOpacity style={styles.iconContainer}>
                <Icon name="search" size={24} color="white" />
              </TouchableOpacity>
            </View>
    
            {/* Row 1 */}
            <ScrollView
                      style={styles.scrollContainer}
                      contentContainerStyle={styles.contentContainer}
              onScroll={(event) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                const contentHeight = event.nativeEvent.contentSize.height;
                const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
                console.log('offsetY = ', offsetY);
                console.log('contentHeight =', contentHeight);
                console.log('scrollViewHeight =',  scrollViewHeight);

                  if (offsetY < -10) {

                    // User is scrolling up at the top, fetch the previous question
                    console.log('fetchPreviousQuestionFromCache: called');

                    fetchPreviousQuestionFromCache();
                  } else if (offsetY > 10) {

                    // User is scrolling down at the bottom, fetch the next question
                    console.log('fetchNextQuestionFromCache: called');

                    fetchNextQuestionFromCache();
                  }
                                
              }}
              scrollEventThrottle={0}>
              {questionData && (
                <View style={styles.row1}>
                  {/* Questions/Answers */}
                  <View style={styles.column1}>
                    <View style={styles.questionBackground}>
                      <Text style={styles.question}>{questionData.question}</Text>
                    </View>
                    <View style={styles.choicesContainer}>
                      {questionData.options.map((option) => (
                        <View key={option.id}>
                          <TouchableOpacity
                            key={option.id}
                            style={[
                              styles.choiceBackground,
                              selectedOption === option.id &&
                                (isCorrectAnswer === true
                                  ? styles.correctChoice
                                  : styles.wrongChoice),
                            ]}
                            onPress={() => handleOptionSelect(option.id)}
                            disabled={selectedOption !== null}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                              }}>
                              <Text style={styles.choice}>{option.answer}</Text>
                              {selectedOption === option.id && (
                                <Icon
                                  name={
                                    isCorrectAnswer === true
                                      ? 'thumbs-o-up'
                                      : 'thumbs-o-down'
                                  }
                                  size={24}
                                  color='white'
                                />
                              )}
                            </View>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </View>
    
                  {/* Side Gallery */}
                  <View style={styles.column2}>
                    <View style={styles.sideGallery}>
                      <TouchableOpacity style={styles.sideGalleryItem}>
                        <Icon name={sideGalleryIcons[0].name} size={24} color='white' />
                        <Text style={styles.sideGalleryText}>{sideGalleryIcons[0].text}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.sideGalleryItem}>
                        <Icon name={sideGalleryIcons[1].name} size={24} color='white' />
                        <Text style={styles.sideGalleryText}>{sideGalleryIcons[1].text}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.sideGalleryItem}>
                        <Icon name={sideGalleryIcons[2].name} size={24} color='white' />
                        <Text style={styles.sideGalleryText}>{sideGalleryIcons[2].text}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.sideGalleryItem}>
                        <Icon name={sideGalleryIcons[3].name} size={24} color='white' />
                        <Text style={styles.sideGalleryText}>{sideGalleryIcons[3].text}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.sideGalleryItem}>
                        <Icon name={sideGalleryIcons[4].name} size={24} color='white' />
                        <Text style={styles.sideGalleryText}>{sideGalleryIcons[4].text}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
    
                      {/* Row 2 (User Info) */}
                      {questionData && (
                          <View style={styles.row2}>
                              {/* User Info */}
                              <View style={styles.userInfoContainer}>
                                  <Text style={styles.userInfoText}>{questionData.user.name}</Text>
                                  <Text style={styles.description}>{questionData.description}</Text>
                              </View>
    
                              {/* Playlist Panel */}
                              <View style={styles.playlistPanel}>
                                  <Text style={styles.playlistText}>
                                      <Icon
                                          style={styles.playlistIcon}
                                          name="youtube-play"
                                          size={14}
                                          color="white"
                                      />
                                      <Text style={styles.playlist}>
                                          {'    Playlist - '}{questionData.playlist} {'                                                   '}
                                      </Text>
                                      <Icon
                                          style={styles.playlistIcon}
                                          name="chevron-right"
                                          size={14}
                                          color="white"
                                      />
                                  </Text>
                              </View>
                          </View>
                      )}
            </ScrollView>
          </View>
          {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
        </ImageBackground>
        
      );
    };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 20,
    },
    clockContainer: {
        flexDirection: 'row', // Horizontal layout for clock icon and time
        alignItems: 'center',
      },
    iconContainer: {
    paddingHorizontal: 12,
    },
    titleContainer: {
        flexDirection: 'column', // Horizontal layout for title and space
        alignItems: 'center',
      },
  title: {
    fontSize: 12,
      fontWeight: 'bold',
      color: 'white'

    },
    timer: {
        fontSize: 12,
        color: 'white',
    },
    titleUnderline: {
        width: 32,
        marginTop: 4,
        borderBottomWidth: 4,
        borderBottomColor: 'white',
    },
    titleTextContainer: {
    },
    questionContainer: {
        flex:  9,
        marginTop: 40,
      },
      question: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
      },
      choicesContainer: {
        marginTop: 84,
      },
      choice: {
        fontSize: 13,
        color: 'white',
    },
    questionBackground: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Transparent black background
        padding: 10,
        borderRadius: 8,
    },
    choiceBackground: {
        backgroundColor: 'rgba(128, 128, 128, 0.8)', // Transparent gray background
        padding: 10,
        borderRadius: 8,
        marginBottom: 5,
    },
    nullChoice: {
        backgroundColor: 'rgba(128, 128, 128, 0.8)', // Transparent gray background
    },
    correctChoice: {
        backgroundColor: 'rgba(0, 128, 0, 0.9)', // Transparent gray background
    },
      wrongChoice: {
        backgroundColor: 'rgba(255, 0, 0, 0.8)', // Transparent gray background
    },
    scrollContainer: {
    },
    
    sideGallery: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        marginVertical: 80,
        marginLeft:0,
      },
    
      sideGalleryItem: {
        alignItems: 'flex-end',
        marginBottom: 16,
    },
      
    sideGalleryText: {
        color: 'white',   // Text color
        fontSize: 12,     // Font size
        marginTop: 4,     // Spacing between icon and text
    },
    
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch' if you want to stretch the image
      },
    
      userInfoContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent black background
        borderRadius: 8,
        marginTop: 8, // Adjust the spacing as needed
      },
      userInfoText: {
        color: 'white',
        fontSize: 12, // Adjust the font size as needed
        marginBottom: 5, // Adjust the spacing between lines as needed
    },
    description: {
        color: 'white',
        fontSize: 10, // Adjust the font size as needed
        marginBottom: 5, // Adjust the spacing between lines as needed
    },
    playlist: {
        color: 'white',
        fontSize: 10, // Adjust the font size as needed
    },
    playlistPanel: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        marginTop: 4,
        marginBottom: 4,
        alignItems: 'center',
    },
    playlistText: {
        color: 'white',
        fontSize: 10,
        flexDirection: 'row', // Set flexDirection to 'row' to align items horizontally
        alignItems: 'center', // Center align items vertically
      },
    playlistIcon: {
        padding:16,
        color: 'white',
        justifyContent: 'center'
    },
    mainContainer: {
        flex:1
    },
    row1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 160,
      },
    row2: {
        marginTop: 0,
      },
      column1: {
        flex: 8, // Equal width columns in Row 1
      },
      column2: {
        flex: 2, // Column 1 in Row 2 spans entire width
    },
    column3: {
        flex: 1, // Column 1 in Row 2 spans entire width
    },
    contentContainer: {
        paddingBottom: 16, // Add padding to the bottom of the content
  },
    flatList: {
    flex: 1, // Ensure FlatList takes the full screen height
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
      
});

export default HomeScreen;


