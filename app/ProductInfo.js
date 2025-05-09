import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Alert, Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import AppContext from '../store/AppContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProductInfo = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { addToCart, user, isLoggedIn } = useContext(AppContext);
    const { colors, isDarkMode } = useTheme();
    const [number, setNumber] = useState(1);

    const { id, Name: productName, description: productDescription, price, color, defaultImage } = params;

    const parsedColor = useMemo(() => {
        try {
            return JSON.parse(color);
        } catch (error) {
            return [];
        }
    }, [color]);

    const totalPrice = useMemo(() => number * parseFloat(price), [number, price]);

    const colorMapping = useMemo(() => ({
        'Chroma Teal': '#008080',
        'Chroma Pearl': '#f0f8ff',
        'Chroma Indigo': '#4B0082',
        'Sterling Silver': '#C0C0C0',
        'Volcanic Red': '#FF4500',
        'Cobalt Blue': '#0047AB',
        'Galactic Purple': '#663399',
        'Nova Pink': '#FF69B4',
        'Starlight Blue': '#4682B4',
        'Cosmic Red': '#FF0000',
        'Midnight Black': '#000000',
        'White': '#FFFFFF',
        'Gray Camouflage': '#808080'
    }), []);

    const arraycolor = useMemo(() => {
        if (Array.isArray(parsedColor)) {
            return parsedColor.map(item => ({
                color: item.color || 'default',
                images: item.images?.length > 0 ? item.images : [defaultImage],
                description: item.description || productDescription
            }));
        }
        return defaultImage ? [{
            color: 'default',
            images: [defaultImage],
            description: productDescription
        }] : [];
    }, [parsedColor, defaultImage, productDescription]);

    const [selectedColor, setSelectedColor] = useState(() => arraycolor[0] || null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handleGoBack = useCallback(() => {
        router.back();
    }, [router]);

    const handleAddToCart = useCallback(() => {
        if (!user) {
            Alert.alert(
                "Login Required",
                "Please login to add items to your cart",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Login",
                        onPress: () => router.push('/Login')
                    }
                ]
            );
            return;
        }

        const product = {
            id: params.id || Date.now().toString(),
            name: productName,
            image: selectedColor?.images?.[selectedImageIndex] || defaultImage,
            description: selectedColor?.description || productDescription,
            price: parseFloat(price),
            quantity: number,
            selectedColor: selectedColor?.color || 'Default',
        };

        if (!product.image) {
            Alert.alert('Error', 'Product image is missing');
            return;
        }

        addToCart(product, number);
        Alert.alert('Product added to cart successfully!', 'want go to cart screen?',[
              {
                text: 'no',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'yes', onPress: () => router.push('/Cart')},
            ]);
        }
    , [addToCart, productName, selectedColor, selectedImageIndex, defaultImage, productDescription, price, number, params.id, router, user]);

    const handleInput = useCallback((num) => {
        const parsedNum = parseInt(num);
        if (isNaN(parsedNum) || num === '') {
            setNumber(1);
        } else if (parsedNum < 1) {
            setNumber(1);
        } else {
            setNumber(parsedNum);
        }
    }, []);

    const incrementQuantity = useCallback(() => {
        setNumber(prev => prev + 1);
    }, []);

    const decrementQuantity = useCallback(() => {
        setNumber(prev => prev > 1 ? prev - 1 : 1);
    }, []);

    const renderColorOptions = useCallback(() => (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.colorOptionsScroll}
        >
            <View style={styles.colorOptions}>
                {Object.entries(colorMapping).map(([colorName, hexCode], index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.colorBlock,
                            { backgroundColor: hexCode },
                            colorName === selectedColor?.color && styles.selectedColor,
                            (colorName === 'White' || colorName === 'Chroma Pearl') && styles.lightColorBorder
                        ]}
                        onPress={() => {
                            setSelectedColor({
                                color: colorName,
                                images: arraycolor.find(c => c.color === colorName)?.images || [defaultImage],
                                description: arraycolor.find(c => c.color === colorName)?.description || productDescription
                            });
                            setSelectedImageIndex(0);
                        }}
                    >
                        {colorName === selectedColor?.color && (
                            <View style={styles.checkmark}>
                                <Text style={styles.checkmarkText}>✓</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    ), [selectedColor, arraycolor, defaultImage, productDescription, colorMapping]);

    const renderImageGallery = useCallback(() => {
        const currentImage = selectedColor?.images?.[selectedImageIndex] || defaultImage;
        
        return (
            <View style={styles.imageGalleryContainer}>
                {currentImage ? (
                    <Image
                        source={{ uri: currentImage }}
                        style={styles.mainImage}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={styles.noImageContainer}>
                        <Text style={styles.noImageText}>No image available</Text>
                    </View>
                )}
                
                {selectedColor?.images?.length > 1 && (
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        style={styles.thumbnailScroll}
                    >
                        {selectedColor.images.map((image, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedImageIndex(index)}
                                style={[
                                    styles.thumbnailContainer,
                                    selectedImageIndex === index && styles.selectedThumbnail
                                ]}
                            >
                                <Image
                                    source={{ uri: image }}
                                    style={styles.thumbnailImage}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>
        );
    }, [selectedColor, selectedImageIndex, defaultImage]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        backButton: {
            padding: 16,
            zIndex: 1,
        },
        backButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
        },
        imageGalleryContainer: {
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT * 0.4,
            backgroundColor: colors.surface,
        },
        mainImage: {
            width: '100%',
            height: '100%',
        },
        noImageContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        noImageText: {
            fontSize: 16,
            color: colors.textSecondary,
        },
        thumbnailScroll: {
            position: 'absolute',
            bottom: 16,
            left: 0,
            right: 0,
            paddingHorizontal: 16,
        },
        thumbnailContainer: {
            width: 60,
            height: 60,
            marginRight: 8,
            borderRadius: 8,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: 'transparent',
        },
        selectedThumbnail: {
            borderColor: colors.primary,
        },
        thumbnailImage: {
            width: '100%',
            height: '100%',
        },
        infoContainer: {
            padding: 16,
        },
        productName: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 8,
        },
        price: {
            fontSize: 20,
            fontWeight: '600',
            color: colors.text,
        },
        divider: {
            height: 1,
            backgroundColor: colors.border,
            marginVertical: 16,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 12,
        },
        colorOptionsScroll: {
            marginBottom: 8,
        },
        colorOptions: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            paddingVertical: 8,
        },
        colorBlock: {
            width: 40,
            height: 40,
            borderRadius: 20,
            margin: 4,
            ...Platform.select({
                ios: {
                    shadowColor: colors.text,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                },
                android: {
                    elevation: 3,
                },
            }),
        },
        selectedColor: {
            borderWidth: 2,
            borderColor: colors.primary,
        },
        lightColorBorder: {
            borderWidth: 1,
            borderColor: colors.border,
        },
        checkmark: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        checkmarkText: {
            color: isDarkMode ? '#000' : '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
        description: {
            fontSize: 16,
            color: colors.textSecondary,
            lineHeight: 24,
        },
        quantityContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 10,
        },
        quantityButton: {
            backgroundColor: colors.primary,
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10,
        },
        quantityButtonText: {
            color: 'white',
            fontSize: 24,
            fontWeight: 'bold',
        },
        quantityInput: {
            width: 80,
            textAlign: 'center',
            backgroundColor: 'white',
        },
        totalContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 16,
        },
        totalText: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.text,
        },
        totalPrice: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
        },
        buyButton: {
            marginVertical: 16,
            overflow: 'hidden',
            borderRadius: 12,
            ...Platform.select({
                ios: {
                    shadowColor: colors.text,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                },
                android: {
                    elevation: 5,
                },
            }),
        },
        gradientButton: {
            paddingVertical: 16,
            alignItems: 'center',
        },
        buyButtonText: {
            color: colors.buttonText,
            fontSize: 18,
            fontWeight: 'bold',
        },
        colorName: {
            fontSize: 16,
            color: colors.text,
            textAlign: 'center',
            marginTop: 8,
            fontWeight: '500',
        },
        selectedColorContainer: {
            marginTop: 16,
            alignItems: 'center',
        },
        addToCartButton: {
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
        },
        addToCartText: {
            fontSize: 18,
            fontWeight: 'bold',
            color: 'white',
        },
    });
    

    return (
        // <SafeAreaView style={styles.container}>

        
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>

        <TouchableOpacity style={styles.backButton} onPress={() => handleGoBack()}>
            <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

            {renderImageGallery()}

            <View style={styles.infoContainer}>
                <Text style={styles.productName}>{productName}</Text>
                <Text style={styles.price}>₪{price}</Text>
                
                <View style={styles.divider} />
                
                <Text style={styles.sectionTitle}>Available Colors</Text>
                {renderColorOptions()}
                {selectedColor && selectedColor.color !== 'default' && (
                    <View style={styles.selectedColorContainer}>
                        <Text style={styles.colorName}>
                            Selected Color: {selectedColor.color}
                        </Text>
                    </View>
                )}
                
                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{selectedColor?.description || productDescription}</Text>
                
                <View style={styles.divider} />

                <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={decrementQuantity} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.quantityInput}
                        keyboardType="numeric"
                        value={number.toString()}
                        onChangeText={handleInput}
                        mode="outlined"
                        theme={{
                            colors: { background: 'white' }
                        }}
                    />
                    <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Total:</Text>
                    <Text style={styles.totalPrice}>₪{totalPrice.toLocaleString()}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    {isLoggedIn ? (
                        <TouchableOpacity
                            style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
                            onPress={handleAddToCart}
                        >
                            <Text style={styles.addToCartText}>Add to Cart</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
                            onPress={() => router.push('/(app)/Login')}
                        >
                            <Text style={styles.addToCartText}>Login to Shop</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </ScrollView>
        // </SafeAreaView>
    );
};


export default ProductInfo;