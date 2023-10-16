import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Use the appropriate icon library
import { StatusBar } from 'react-native';
import { useState, useEffect } from 'react'; // Import React and React hooks


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
          setQuestionData(data);
          console.log("current id is: ", data.id)
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

    const fetchNextQuestion = () => {
        setIsCorrectAnswer(null);
        setSelectedOption(null);
        
        fetch('https://cross-platform.rp.devfactory.com/for_you')
          .then((response) => response.json())
          .then((data) => {
              setQuestionData(data);
              console.log("current id is: ", data.id);
              console.log("current question is: ", data.question);

          })
          .catch((error) => {
            console.error('Error fetching next question:', error);
          });
      };
    
    return (
        <ImageBackground
      source={require('../assets/background.jpeg')} // Replace with the correct path to your local image
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
    
          <ScrollView
        style={styles.scrollContainer}
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          const contentHeight = event.nativeEvent.contentSize.height;
          const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

          // Check if the user has reached the end of the scroll view
          if (offsetY + scrollViewHeight >= contentHeight - 20) {
            fetchNextQuestion();
          }
        }}
        scrollEventThrottle={400} // Adjust as needed
      >

              {questionData && (
                  <View style={styles.contentContainer}>

        <View style={styles.questionContainer}>
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
                      : styles.wrongChoice)
                ]}
                onPress={() => handleOptionSelect(option.id)}
                disabled={selectedOption !== null}
                                            >
                                                <View style={{
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                alignItems:"baseline"}}>
                    <Text style={styles.choice}>{option.answer} 
                                                    </Text>
                                                    {selectedOption === option.id && (<Icon
                                                    name={isCorrectAnswer === true ? "thumbs-o-up" : "thumbs-o-down"}
                                                size={24}
                                                color='white'
                                                />
              )}</View>
                    
                </TouchableOpacity>
                            </View>
               
                                    ))}
                                    
                                </View>
                                


        </View>
            <View style={styles.sideGallery}>
                <TouchableOpacity style={styles.sideGalleryItem}>
                      <Icon name={sideGalleryIcons[0].name} size={24} color="white" />
                      <Text style={styles.sideGalleryText}>{sideGalleryIcons[0].text}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sideGalleryItem}>
                  <Icon name={sideGalleryIcons[1].name} size={24} color="white" />
                  <Text style={styles.sideGalleryText}>{sideGalleryIcons[1].text}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.sideGalleryItem}>
                      <Icon name={sideGalleryIcons[2].name} size={24} color="white" />
                      <Text style={styles.sideGalleryText}>{sideGalleryIcons[2].text}</Text>
                </TouchableOpacity><TouchableOpacity style={styles.sideGalleryItem}>
                      <Icon name={sideGalleryIcons[3].name} size={24} color="white" />
                      <Text style={styles.sideGalleryText}>{sideGalleryIcons[3].text}</Text>
                </TouchableOpacity><TouchableOpacity style={styles.sideGalleryItem}>
                      <Icon name={sideGalleryIcons[4].name} size={24} color="white" />
                      <Text style={styles.sideGalleryText}>{sideGalleryIcons[4].text}</Text>
                </TouchableOpacity>
            
              
            </View>
          </View>
                    )}
                    
                     
                </ScrollView>
                {questionData && (
                        <View>
                <View style={styles.userInfoContainer}>
                <Text style={styles.userInfoText}>
                  {questionData.user.name}
                </Text>
                <Text style={styles.description}>
                  {questionData.description}
                </Text>
              </View>
                                        <View style={styles.playlistPanel}>

                            <Text style={styles.playlistText}>
                                <Icon style={styles.playlistIcon} name="youtube-play" size={14} color="white"/>
                                <Text style={styles.playlist}>{'    Playlist - '}{questionData.playlist} {'                                                   ' }</Text>
                                 <Icon style={styles.playlistIcon } name="chevron-right" size={14} color="white" /></Text>
                            </View>
          </View>
        )}
      </View>
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
        flex: 1, // Take up remaining vertical space
    },
    contentContainer: {
        flexDirection: 'row', // Arrange content and side gallery side by side
      },
    
    sideGallery: {
          flex:1,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        marginVertical: 200,
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

    flexDirection: 'row', // Set flexDirection to 'row' to align items horizontally

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
      
});

export default HomeScreen;


